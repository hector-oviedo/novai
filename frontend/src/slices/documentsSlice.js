import { createSlice } from "@reduxjs/toolkit";
import {
  fetchDocuments,
  uploadDocument,
  removeDocument,
  attachDocument,
  detachDocument
} from "./documentsThunks";

const documentsSlice = createSlice({
  name: "documents",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(removeDocument.fulfilled, (state, action) => {
        state.list = state.list.filter((doc) => doc.id !== action.payload);
      })
      .addCase(attachDocument.fulfilled, (state, action) => {
        const { documentId, sessionId } = action.payload;
        const doc = state.list.find((d) => d.id === documentId);
        if (doc) {
          if (!doc.sessions) doc.sessions = [];
          doc.sessions.push(sessionId);
        }
      })
      .addCase(detachDocument.fulfilled, (state, action) => {
        const { documentId, sessionId } = action.payload;
        const doc = state.list.find((d) => d.id === documentId);
        if (doc) {
          doc.sessions = doc.sessions.filter((s) => s !== sessionId);
        }
      });
  },
});

export default documentsSlice.reducer;
