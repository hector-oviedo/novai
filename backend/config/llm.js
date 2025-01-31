// config/llm.js
const { Ollama, Settings } = require('llamaindex');
const config = require('./config');

function initializeLLM() {
  Settings.llm = new Ollama({
    model: config.LLM.MODEL,
    temperature: config.LLM.TEMPERATURE,
    maxTokens: config.LLM.MAX_TOKENS,
    contextWindow: config.LLM.CONTEXT_WINDOW
  });
}

module.exports = { initializeLLM };