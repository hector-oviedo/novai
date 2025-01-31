const express = require('express');
const { getTokenStatus } = require('../controllers/token.controller');

const router = express.Router();

router.post('/status', getTokenStatus);

module.exports = router;