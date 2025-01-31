const express = require('express');
const cors = require('cors');
const { initializeLLM } = require('./config/llm');
const { chatLimiter } = require('./config/rateLimit');

// Init
const app = express();
initializeLLM();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/chat', chatLimiter, require('./routes/chat.routes'));
app.use('/tokens', require('./routes/token.routes'));

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));