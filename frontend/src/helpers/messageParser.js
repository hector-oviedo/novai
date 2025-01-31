// messageParser.js
import { v4 as uuidv4 } from 'uuid';

/**
 * parseLLMResponse
 * Extracts <think>...</think> from text, returning { text, think }.
 */
export function parseLLMResponse(rawText = '') {
  const THINK_OPEN = '<think>';
  const THINK_CLOSE = '</think>';

  let text = rawText;
  let think = '';

  const openIdx = text.indexOf(THINK_OPEN);
  const closeIdx = text.indexOf(THINK_CLOSE, openIdx + THINK_OPEN.length);
  if (openIdx !== -1 && closeIdx !== -1) {
    think = text.slice(openIdx + THINK_OPEN.length, closeIdx).trim();
    text = text.slice(0, openIdx) + text.slice(closeIdx + THINK_CLOSE.length);
  }

  return {
    think,
    text: text.trim(),
    thinking:false,
  };
}

/**
 * createNewMessage
 * Builds a standardized message object with unique id, type, text, and think fields.
 */
export function createNewMessage({ msgType, content, sessionId }) {
  const { text, think } = parseLLMResponse(content);
  return {
    id: uuidv4(),
    sessionId: sessionId || uuidv4(),
    type: msgType, // 'user', 'output', or 'error'
    think,
    text,
    thinking:false,
  };
}