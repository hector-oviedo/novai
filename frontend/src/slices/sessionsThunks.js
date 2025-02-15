// src/slices/sessionsThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../apiClient";
import { clearMessages, addFetchedMessages } from "./messageSlice";

// 1) List sessions
export const fetchSessions = createAsyncThunk("sessions/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get("/sessions");
    return response.data; // [ { session_id, title }, ... ]
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch sessions");
  }
});

// 2) Create session
export const createSession = createAsyncThunk("sessions/create", async ({ title }, { rejectWithValue }) => {
  try {
    const response = await apiClient.post("/sessions", { title });
    // returns { session_id, title }
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to create session");
  }
});

// 3) Fetch messages for a session
export const fetchSessionById = createAsyncThunk(
  "sessions/fetchById",
  async ({ sessionId }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(clearMessages());
      const response = await apiClient.get(`/sessions/${sessionId}/messages`, {
        params: { limit: 5 }
      });
      // returns an array of messages
      dispatch(addFetchedMessages(response.data));
      return { sessionId, messages: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch session messages");
    }
  }
);

// 4) Delete session
export const deleteSession = createAsyncThunk("sessions/delete", async ({ sessionId }, { rejectWithValue }) => {
  try {
    await apiClient.delete(`/sessions/${sessionId}`);
    // returns { "message": "Session X deleted" }
    return sessionId; 
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to delete session");
  }
});
