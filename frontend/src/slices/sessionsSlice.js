// src/slices/sessionsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchSessions, createSession, fetchSessionById, deleteSession } from "./sessionsThunks";

const sessionsSlice = createSlice({
  name: "sessions",
  initialState: {
    list: [],
    currentSession: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentSession: (state, action) => {
      state.currentSession = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchSessions
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createSession
      .addCase(createSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.loading = false;
        const { session_id, title } = action.payload;
        const newSession = { session_id, title };
        state.list.push(newSession);
        state.currentSession = newSession;
      })
      .addCase(createSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchSessionById
      .addCase(fetchSessionById.fulfilled, (state, action) => {
        // Some optional logic if you want
      })

      // deleteSession
      .addCase(deleteSession.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.list = state.list.filter((sess) => sess.session_id !== deletedId);
        if (state.currentSession?.session_id === deletedId) {
          state.currentSession = null;
        }
      });
  },
});

export const { setCurrentSession } = sessionsSlice.actions;
export default sessionsSlice.reducer;
