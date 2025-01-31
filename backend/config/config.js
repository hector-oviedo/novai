// config.js
require('dotenv').config();

module.exports = {
  LLM: {
    MODEL: process.env.LLM_MODEL || 'deepseek-r1:1.5b',
    TEMPERATURE: parseFloat(process.env.LLM_TEMP) || 0.7,
    MAX_TOKENS: parseInt(process.env.LLM_MAX_TOKENS) || 2048,
    CONTEXT_WINDOW: parseInt(process.env.LLM_CONTEXT_WINDOW) || 32768
  },
  MEMORY: {
    TOKEN_LIMIT: parseInt(process.env.MEM_TOKEN_LIMIT) || 2048,
    TOKEN_RESERVE: parseInt(process.env.MEM_TOKEN_RESERVE) || 2048
  }
};