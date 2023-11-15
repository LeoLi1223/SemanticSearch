# SemanticSearch
A simple search application utilizes OpenAI's text embedding to generate top `k` results which are similar to the search term. The similarity is computed by the cosine similarity between the two embedding vectors, which is recommended by the OpenAI's documentation.
### Feel free to play around
Steps:
- Download the repo
- In the configs/OpenaiConfig.js, change the `Process.env.OPENAI_API_KEY` to your own OpenAI API key. You can easily create a key here https://platform.openai.com/api-keys.
- In the playground.js, fill the target list with the terms of your interest, and edit the search term as well.
- In the command line, run `node ./playground.js`, and then, the top k similar result will be printed out.


 Credit to https://github.com/sgheith/semantic_search_node.git.
 
 Note: This repo uses OpenAI API @ 4.0.0, but the above does not. Then, there are some minor differences in API calls.
