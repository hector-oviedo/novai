// src/slices/messageThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { addUserMessage, addStreamChunk, finalizeAssistantMessage } from "./messageSlice";
import apiClient from "../apiClient";

// 1) Streaming
export const sendStreamMessage = createAsyncThunk(
  "messages/sendStreamMessage",
  async ({ sessionId, userMessage }, { dispatch, rejectWithValue }) => {
    try {
      // Insert user message in Redux
      dispatch(addUserMessage({ sessionId, text: userMessage }));

      // Start streaming
      const response = await fetch("http://localhost:8000/chat/stream", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, user_message: userMessage }),
      });

      if (!response.ok) throw new Error("Stream request failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let done = false;
      let partial = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          partial += decoder.decode(value, { stream: true });
          let lines = partial.split("\n");
          partial = lines.pop(); // leftover partial line
          for (const line of lines) {
            if (!line.trim()) continue;
            const parsed = JSON.parse(line); // { type, chunk }
            dispatch(addStreamChunk({
              sessionId,
              chunkType: parsed.type,
              chunk: parsed.chunk
            }));
          }
        }
      }

      dispatch(finalizeAssistantMessage({ sessionId }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 2) Update message
export const updateMessage = createAsyncThunk(
  "messages/updateMessage",
  async ({ sessionId, messageId, newContent }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `/sessions/${sessionId}/messages/${messageId}`,
        { content: newContent }
      );
      return response.data; 
      // e.g. { id, sender, content, think }
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update message");
    }
  }
);

// 3) Delete message
export const deleteMessage = createAsyncThunk(
  "messages/deleteMessage",
  async ({ sessionId, messageId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(
        `/sessions/${sessionId}/messages/${messageId}`
      );
      // returns { message: "Message X deleted" }
      return messageId; 
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete message");
    }
  }
);
