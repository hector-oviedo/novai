const { body } = require('express-validator');

const chatValidation = [
  body('sessionId').isString().notEmpty(),
  body('messages').isArray({ min: 1 }),
  body('messages.*.text').isString().notEmpty()
];

const tokenValidation = [
  body('sessionId').isString().notEmpty()
];

module.exports = { chatValidation, tokenValidation };