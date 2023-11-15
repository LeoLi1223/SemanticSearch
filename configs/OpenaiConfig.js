/**
 * Configure the OpenAI generative instance.
 */

// import OpenAI API 
const OpenAI = require('openai');

// Create a new openai instance using my api key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// make the instance public
module.exports = {openai};