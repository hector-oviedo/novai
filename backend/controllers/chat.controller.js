const chatService = require('../services/chat.service');
const memoryManager = require('../config/memory');

async function streamChat(req, res) {
  try {
    const { sessionId, messages } = req.body;
    const { stream, userMessage } = await chatService.handleChat(sessionId, messages);
    await chatService.processStream(stream, res, sessionId, userMessage);
  } catch (error) {
    console.error('Stream error:', error);
    res.status(500).json({ error: 'Stream failed' });
  }
}

async function simpleChat(req, res) {
  try {
    const { sessionId, messages } = req.body;
    const stream = await chatService.handleChat(sessionId, messages);
    
    let response = '';
    for await (const chunk of stream) {
      response += chunk.delta;
    }
    
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Chat failed' });
  }
}

module.exports = { streamChat, simpleChat };