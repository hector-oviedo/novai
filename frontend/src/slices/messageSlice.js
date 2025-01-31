import { v4 as uuidv4 } from 'uuid';
import { createSlice } from '@reduxjs/toolkit';
import { createNewMessage, parseLLMResponse } from '../helpers/messageParser';
import { createNewStreamMessage } from '../helpers/messageStreamHelper';

export const InteractionState = {
  READY: 'ready',
  INFERENCE: 'inference',
  ERROR: 'error',
};

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
    interactionState: InteractionState.READY,
    actualSession:null,
  },
  reducers: {
    /**
     * addUserMessage
     * Creates a 'user' message from the raw input text.
     */
    addUserMessage: (state, action) => {
      const sessionId = state.actualSession || uuidv4();
      state.messages.push(
        createNewMessage({
          msgType: 'user',
          content: action.payload,
          sessionId,
        })
      );
    },

    /**
     * addOutputMessage
     * Creates an 'output' message from response text.
     */
    addOutputMessage: (state, action) => {
      const sessionId = state.actualSession || uuidv4();
      state.messages.push(
        createNewMessage({
          msgType: 'output',
          content: action.payload.text,
          sessionId,
        })
      );
    },

    /**
     * addErrorMessage
     * Creates an 'error' message from error text.
     */
    addErrorMessage: (state, action) => {
      const sessionId = state.actualSession || uuidv4();
      state.messages.push(
        createNewMessage({
          msgType: 'error',
          content: action.payload,
          sessionId,
        })
      );
    },

    /**
     * setInteractionState
     * Updates the overall interaction state (READY, INFERENCE, ERROR).
     */
    setInteractionState: (state, action) => {
      state.interactionState = action.payload;
    },

    /**
     * setSession
     * Updates the the actual Session ID
     */
    setSession: (state, action) => {
      state.actualSession = action.payload; // Set a specific session ID
    },
    /**
     * startStreamingOutput
     * Creates an empty 'output' message to be updated incrementally.
     */
    startStreamingOutput: (state) => {
      const sessionId = state.actualSession || uuidv4();
      const msg = createNewStreamMessage({ sessionId });
    
      state.messages.push(msg); // Add the new streaming message to the state
      state.currentStreamingMessageId = msg.id; // Store the message ID for tracking
    },

    /**
     * appendToStreamingOutput
     * Finds the streaming output message by ID and appends chunked text to it.
     */
    appendToStreamingOutput: (state, action) => {
      const { msgId, chunk, sessionId } = action.payload;
      const existing = state.messages.find(
        (m) => m.id === msgId && m.sessionId === sessionId
      );
      if (!existing) return;
    
      // Update "text" and ensure "thinking" is false
      existing.text = (existing.text || '') + chunk;
      existing.thinking = false; // End "thinking" mode when normal text continues
    },
    
    appendToThinkingOutput: (state, action) => {
      const { msgId, chunk, sessionId } = action.payload;
      const existing = state.messages.find(
        (m) => m.id === msgId && m.sessionId === sessionId
      );
      if (!existing) return;
    
      // Append to "think" and update "thinking" state
      existing.think = (existing.think || '') + chunk;
      existing.thinking = true; // Keep the "thinking" flag true during streaming
    },  
  },
});

export const {
  addUserMessage,
  addOutputMessage,
  addErrorMessage,
  setInteractionState,
  setSession,
  startStreamingOutput,
  appendToStreamingOutput,
  appendToThinkingOutput,
} = messageSlice.actions;

export default messageSlice.reducer;
