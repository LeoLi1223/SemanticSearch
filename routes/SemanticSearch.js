/**
 * The file includes the main functionality of generating embeddings for texts,
 * and also supports caching the (text, embedding) pair in the `embedding` folder
 */

// import necessary componenets from modules
const {openai} = require('../configs/OpenaiConfig.js'); // openai instance
const fs = require('node:fs'); // file system handler for caching
const path = require('path'); // path module

// specity the absolute path for the cache file
const CACHE_FILE_PATH = path.join(__dirname + '/../embeddings/embeddings.csv');

// specify embedding model
const embedding_model = 'text-embedding-ada-002';

/**
 * Generate the embedding for the given text.
 * @param {string} text the text for which to generate the embedding
 * @returns the corresponding embedding for the text
 */
const generateEmbedding = async (text) => {
    // read cached embeddings
    const cacheMap = readCache();

    // if the text is cached, return the corresponding embedding
    if (cacheMap.has(text)) {
        const embedding = cacheMap.get(text);
        return embedding;
    }

    // call openai embedding api to generate the embedding
    const response = await openai.embeddings.create({
        model: embedding_model,
        input: text,
    })

    // extract the embedding from the response
    const embedding = response.data[0].embedding;

    // cache the new (text, embedding) pair
    appendToCache(text, embedding);

    return embedding;
};

/**
 * read and format the cache file to a map of (text, embedding) pairs.
 * @returns the map of (text, embedding) pairs
 */
const readCache = () => {
    try {
        if (!fs.existsSync(CACHE_FILE_PATH)) {
            fs.writeFileSync(CACHE_FILE_PATH, 'test\tembedding\n', 'utf-8');
            return new Map();
        }
        const cacheFile = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
        const lines = cacheFile.trim().split('\n');

        let cacheMap = new Map();
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (line) {
                const [text, embedding] = line.split('\t');
                cacheMap.set(text, JSON.parse(embedding));
            }
        }

        return cacheMap;
    } catch (error) {
        return new Map();
    }
}

/**
 * Append the new (text, embedding) to the end of the cache file.
 * @param {string} text the text in the new pair
 * @param {number[]} embeddingVector the vector-object of the embedding 
 */
const appendToCache = (text, embeddingVector) => {
    // check if the text is already cached
    const cacheMap = readCache();

    // avoid repeating cache.
    if (cacheMap.has(text)) {
        return;
    }

    // convert the vector object to a string
    const embeddingString = JSON.stringify(embeddingVector);

    // format the new line in the cache file
    const newCacheLine = `${text}\t${embeddingString}\n`;

    // append the new line to the cache file
    fs.appendFileSync(CACHE_FILE_PATH, newCacheLine, 'utf-8');

    // Optional: keep the cacheMap consistent with the cache file
    cacheMap.set(text, embeddingVector);
}

/**
 * Main functionality. Search the top `k` results in the `targetList` similar to the `searchTerm`.
 * @param {string} searchTerm 
 * @param {string[]} targetList 
 * @param {number} k an integer which represents the number of most similar results to output
 */
const semanticSearch = async (searchTerm, targetList, k) => {
    // get the embedding for the search term
    const search_embedding = await generateEmbedding(searchTerm);

    // initialize a list to store the similarity between the search term and the ith term in the target list
    const similarities = new Array(targetList.length);

    // compute the similarity between the search term and each term in the target list
    for (let i = 0; i < targetList.length; i++) {
        const ith_term = targetList[i];
        const ith_embedding = await generateEmbedding(ith_term);
        const similarity = cosineSimilarity(search_embedding, ith_embedding);
        similarities[i] = {
            index: i,
            text: ith_term,
            similarity: similarity,
        };
    }

    // sort the similarities in descending order in place
    similarities.sort((s1, s2) => s2.similarity - s1.similarity);

    // get the first k most similar terms in the targetList
    return similarities.slice(0, k);
}

/**
 * Compute the cosine similarity between the two given vectors. The two vectors must have the same length.
 * @param {number[]} vecA first vector
 * @param {number[]} vecB second vector
 * @returns the value representing the cosine similarity. Smaller, the less similar. Larger, the more similar.
 */
const cosineSimilarity = (vecA, vecB)=> {
    return dotProduct(vecA, vecB) / (norm(vecA) * norm(vecB));
};

const dotProduct = (vecA, vecB) => {
    let result = 0;
    for (let i = 0; i < vecA.length; i++) {
        result += vecA[i] * vecB[i];
    }
    return result;
};

const norm = (vec) => {
    let result = 0;
    for (let i = 0; i < vec.length; i++) {
        result += vec[i] * vec[i];
    }
    result = Math.sqrt(result);
    return result;
};

module.exports = { generateEmbedding, cosineSimilarity, semanticSearch };
