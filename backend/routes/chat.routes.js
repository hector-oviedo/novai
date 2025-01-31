const express = require('express');
const { chatValidation } = require('../middleware/validation');
const { streamChat, simpleChat } = require('../controllers/chat.controller');

const router = express.Router();

router.post('/stream', chatValidation, streamChat);
router.post('/simple', chatValidation, simpleChat);

module.exports = router;