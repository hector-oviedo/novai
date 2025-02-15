import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../apiClient"; // Import the shared client

export const fetchDocuments = createAsyncThunk("documents/fetch", async () => {
  // Example: the backend might be a GET /documents/list that reads user_id from the JWT cookie
  const response = await apiClient.get("/documents/list");
  return response.data;
});

export const uploadDocument = createAsyncThunk(
  "documents/upload",
  async ({ name, description, file }) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description || "");
    formData.append("file", file);

    const response = await apiClient.post("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const removeDocument = createAsyncThunk(
  "documents/remove",
  async (documentId) => {
    // The server side might do a DELETE or POST /documents/delete reading user from the cookie
    const response = await apiClient.post("/documents/delete", { doc_id: documentId });
    // Return documentId so the reducer can remove it from state
    return documentId;
  }
);

export const attachDocument = createAsyncThunk(
  "documents/attach",
  async ({ documentId, sessionId }) => {
    await apiClient.post("/documents/attach", {
      doc_id: documentId,
      session_id: sessionId,
    });
    return { documentId, sessionId };
  }
);

export const detachDocument = createAsyncThunk(
  "documents/detach",
  async ({ documentId, sessionId }) => {
    await apiClient.post("/documents/detach", {
      doc_id: documentId,
      session_id: sessionId,
    });
    return { documentId, sessionId };
  }
);
