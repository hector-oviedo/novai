const memoryManager = require('../config/memory');

async function getTokenStatus(req, res) {
  try {
    const { sessionId } = req.body;
    const status = await memoryManager.getTokenStatus(sessionId);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Token check failed' });
  }
}

module.exports = { getTokenStatus };