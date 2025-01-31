const { Settings } = require('llamaindex');
const memoryManager = require('../config/memory');

class ChatService {
  constructor() {
    //this.systemMessage = { role: "system", content: "Your rules here" };
  }

  async processStream(stream, res, sessionId, userMessage) { // Add params
    try {
      let fullResponse = "";
      for await (const chunk of stream) {
        const content = chunk.delta;
        res.write(content);
        fullResponse += content;
      }
      res.end();
  
      // Store messages AFTER stream completes
      const memory = memoryManager.getMemory(sessionId);
      await memory.put(userMessage);
      await memory.put({ 
        role: "assistant", 
        content: fullResponse 
      });
      
      console.log(`Stored messages for ${sessionId}:`, 
        (await memory.getMessages()).length
      );
  
      return fullResponse;
    } catch (error) {
      console.error('Stream error:', error);
      res.status(500).end();
      throw error;
    }
  }
  
  async handleChat(sessionId, messages) {
    const memory = memoryManager.getMemory(sessionId);
    const history = await memory.getMessages();
    
    // Store user message FIRST
    const userMessage = { 
      role: "user", 
      content: messages[0].text 
    };
    await memory.put(userMessage);
  
    console.log(`After user message (${sessionId}):`, 
      (await memory.getMessages()).length
    );
  
    const fullMessages = [
      //this.systemMessage,
      ...history,
      userMessage
    ];
  
    return { 
      stream: await Settings.llm.chat({
        messages: fullMessages,
        stream: true
      }),
      userMessage 
    };
  }
}

module.exports = new ChatService();