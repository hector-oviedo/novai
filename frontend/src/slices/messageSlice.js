// src/slices/messageSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { sendStreamMessage, updateMessage, deleteMessage } from "./messageThunks";

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    interactionState: "ready",
    error: null,
  },
  reducers: {
    addUserMessage: (state, action) => {
      const { sessionId, text } = action.payload;
      state.messages.push({
        id: Date.now(), // local ID
        sender: "user",
        sessionId,
        content: text,
        think: ""
      });
    },
    addStreamChunk: (state, action) => {
      const { sessionId, chunkType, chunk } = action.payload;
      let last = state.messages[state.messages.length - 1];
      if (!last || last.sender !== "assistant" || last.sessionId !== sessionId) {
        last = {
          id: Date.now(),
          sessionId,
          sender: "assistant",
          content: "",
          think: ""
        };
        state.messages.push(last);
      }
      if (chunkType === "thinking") {
        last.think += chunk;
      } else {
        last.content += chunk;
      }
    },
    finalizeAssistantMessage: (state, action) => {
      // finalize streaming, e.g. set interactionState back to ready
      state.interactionState = "ready";
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    addFetchedMessages: (state, action) => {
      // action.payload is an array of { id, sender, content, think }
      state.messages = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendStreamMessage.pending, (state) => {
        state.interactionState = "inference";
      })
      .addCase(sendStreamMessage.rejected, (state, action) => {
        state.error = action.payload;
        state.interactionState = "error";
      })
      .addCase(updateMessage.fulfilled, (state, action) => {
        // we get updatedMsg = { id, sender, content, think }
        const updatedMsg = action.payload;
        const idx = state.messages.findIndex((m) => m.id === updatedMsg.id);
        if (idx >= 0) {
          state.messages[idx] = updatedMsg;
        }
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        const messageId = action.payload;
        state.messages = state.messages.filter((m) => m.id !== messageId);
      });
  },
});

export const {
  addUserMessage,
  addStreamChunk,
  finalizeAssistantMessage,
  clearMessages,
  addFetchedMessages
} = messageSlice.actions;

export default messageSlice.reducer;