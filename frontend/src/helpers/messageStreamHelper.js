import { v4 as uuidv4 } from 'uuid';
import { appendToStreamingOutput, appendToThinkingOutput } from "../slices/messageSlice";

/**
 * processStreamingResponse
 * Processes the response stream and updates Redux state dynamically.
 */
export async function processStreamingResponse(response, dispatch, msgId, sessionId) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = ''; // Buffer for incoming chunks
  let isThinking = false; // Track if inside a <think> block
  let thinkBuffer = ''; // Buffer for <think> content

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    while (buffer.includes('<think>') || buffer.includes('</think>')) {
      if (isThinking) {
        const closeTagIndex = buffer.indexOf('</think>');

        if (closeTagIndex !== -1) {
          // Close </think> tag found, process the think buffer
          thinkBuffer += buffer.slice(0, closeTagIndex);
          dispatch(
            appendToThinkingOutput({
              msgId,
              chunk: thinkBuffer,
              sessionId,
            })
          );

          thinkBuffer = ''; // Clear the think buffer
          buffer = buffer.slice(closeTagIndex + 8); // Remove </think> tag
          isThinking = false; // Exit "thinking" mode
        } else {
          // No closing tag yet, accumulate content
          thinkBuffer += buffer;
          buffer = ''; // Clear the buffer to accumulate more chunks
          break;
        }
      } else {
        const openTagIndex = buffer.indexOf('<think>');

        if (openTagIndex !== -1) {
          // Dispatch normal text before the <think> tag
          const normalText = buffer.slice(0, openTagIndex);
          if (normalText.trim()) {
            dispatch(
              appendToStreamingOutput({
                msgId,
                chunk: normalText,
                sessionId,
              })
            );
          }
          isThinking = true; // Enter "thinking" mode
          buffer = buffer.slice(openTagIndex + 7); // Remove <think> tag
        } else {
          // No <think> tag, treat as normal text
          if (buffer.trim()) {
            dispatch(
              appendToStreamingOutput({
                msgId,
                chunk: buffer,
                sessionId,
              })
            );
          }
          buffer = ''; // Clear the buffer
          break;
        }
      }
    }

    // Process remaining buffer outside of tags
    if (!isThinking && buffer.trim()) {
      dispatch(
        appendToStreamingOutput({
          msgId,
          chunk: buffer,
          sessionId,
        })
      );
      buffer = ''; // Clear the buffer
    }
  }

  // Handle leftover "thinking" text
  if (isThinking && thinkBuffer.trim()) {
    dispatch(
      appendToThinkingOutput({
        msgId,
        chunk: thinkBuffer,
        sessionId,
      })
    );
  }

  // Ensure thinking flag is reset when the stream ends
  dispatch(
    appendToThinkingOutput({
      msgId,
      chunk: '', // No additional content
      sessionId,
    })
  );
}



/**
 * createNewStreamMessage
 * Generates a new message structure specifically for streaming.
 */
export function createNewStreamMessage({ sessionId }) {
  return {
    id: uuidv4(),
    sessionId: sessionId || uuidv4(),
    type: 'output',  // By default, this will be for streaming outputs
    text: '',        // Start with an empty text
    think: '',       // Start with an empty think field
    thinking: false, // Default to not thinking
  };
}