const { ChatMemoryBuffer, Ollama, Settings } = require('llamaindex');
const config = require('./config');

class MemoryManager {
  constructor() {
    this.sessions = new Map();
    this.tokenizer = Settings.llm.tokenizer; // Use actual model tokenizer
  }

  async getTokenCount(text) {
    const tokens = await this.tokenizer.encode(text);
    return tokens.length;
  }

  getMemory(sessionId) {
    if (!this.sessions.has(sessionId)) {
      console.log(`Creating NEW memory for session: ${sessionId}`);
      this.sessions.set(sessionId, new ChatMemoryBuffer({
        tokenLimit: config.MEMORY.TOKEN_LIMIT,
        tokenizer: this.tokenizer,
        messages: []
      }));
    } else {
      console.log(`Using EXISTING memory for session: ${sessionId}`);
    }
    return this.sessions.get(sessionId);
  }

  async getTokenStatus(sessionId) {
    const memory = this.getMemory(sessionId);
    const current = await memory.getTokenCount();
    return { 
      used: current,
    remaining: config.MEMORY.TOKEN_LIMIT - current,
    safeRemaining: config.LLM.CONTEXT_WINDOW - 
                  current - 
                  config.MEMORY.TOKEN_RESERVE,
    contextWindow: config.LLM.CONTEXT_WINDOW
    };
  }
}

module.exports = new MemoryManager();