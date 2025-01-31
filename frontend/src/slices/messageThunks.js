import { v4 as uuidv4 } from 'uuid';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setInteractionState, setSession, addOutputMessage, addErrorMessage, InteractionState, startStreamingOutput } from './messageSlice';
import { processStreamingResponse } from '../helpers/messageStreamHelper';


/**
 * sendStreamMessage
 * Dispatches inference request with optional file attachment.
 */
export const sendStreamMessage = createAsyncThunk(
    'messages/sendStreamMessage',
    async ({ userInput }, { dispatch, getState, rejectWithValue }) => {
      try {
        const state = getState();
        let sessionId = state.messages.actualSession;
  
        // If no session exists, generate one
        if (!sessionId) {
          sessionId = uuidv4(); // Generate random session ID
          dispatch(setSession(sessionId));
        }
  
        dispatch(setInteractionState('inference'));
  
        // Start the streaming output message
        dispatch(startStreamingOutput());
  
        const response = await fetch('http://127.0.0.1:3000/chat/stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            messages: [{ role: 'user', text: userInput }],
          }),
        });
  
        if (!response.ok) throw new Error('Streaming request failed');
  
        // Get the currentStreamingMessageId from Redux state
        const { currentStreamingMessageId } = getState().messages;
  
        // Process the streaming response
        await processStreamingResponse(response, dispatch, currentStreamingMessageId, sessionId);
  
        dispatch(setInteractionState('ready'));
      } catch (err) {
        const errMsg = err?.message || 'Unknown error';
        console.error(errMsg);
        dispatch(setInteractionState('error'));
        return rejectWithValue(errMsg);
      }
    }
  );

  /**
 * sendMessage (non-streaming)
 * Dispatches inference request with optional file attachment.
 */
export const sendMessage = createAsyncThunk(
    'messages/sendMessage',
    async ({ userInput, file }, { dispatch, rejectWithValue }) => {
      dispatch(setInteractionState(InteractionState.INFERENCE));
      try {
        const formData = new FormData();
        formData.append('message', userInput);
        if (file) formData.append('attachment', file);
  
        const response = await fetch('http://127.0.0.1:3000/inference', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) throw new Error('Non-streaming request failed');
  
        const { message } = await response.json();
        dispatch(addOutputMessage(message));
        dispatch(setInteractionState(InteractionState.READY));
      } catch (err) {
        const errMsg = err?.message || 'Unknown error';
        dispatch(addErrorMessage(errMsg));
        dispatch(setInteractionState(InteractionState.ERROR));
        return rejectWithValue(errMsg);
      }
    }
);
