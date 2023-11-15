const {generateEmbedding, cosineSimilarity, semanticSearch} = require('./routes/SemanticSearch')

const text1 = "It's raining outside."
const text2 = "The weather is rainy."
const text3 = "I gonna go shopping."

// generateEmbedding(text2)
//     .then(embedding1 => {
//         generateEmbedding(text3)
//             .then(embedding2 => {
//                 similarity = cosineSimilarity(embedding1, embedding2);
//                 console.log(similarity);
//             })
//     });

let targetList = [
    "It's raining cats and dogs outside",
    "It's pouring rain outside",
    "The weather outside is awful, it's a complete downpour",
    "The rain is coming down heavily outside",
    "Outside, it's a torrential downpour",
    "I need to pick up some groceries",
    "I need to do some grocery shopping",
    "I have to buy some groceries",
    "I need to go shopping for food",
    "I need to get some food from the supermarket"
    ];

semanticSearch(text3, targetList, 8)
    .then(res => console.log(res))
    .catch(err => console.log(err));