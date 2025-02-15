import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../apiClient";

export const fetchTools = createAsyncThunk("tools/fetch", async () => {
  // Change from post to get, so it matches @router.get("/list").
  const response = await apiClient.get("/tools/list");
  return response.data;
});

export const attachTool = createAsyncThunk(
  "tools/attach",
  async ({ toolId, sessionId }) => {
    await apiClient.post("/tools/attach", {
      tool_id: toolId,
      session_id: sessionId,
    });
    return { toolId, sessionId };
  }
);

export const detachTool = createAsyncThunk(
  "tools/detach",
  async ({ toolId, sessionId }) => {
    await apiClient.post("/tools/detach", {
      tool_id: toolId,
      session_id: sessionId,
    });
    return { toolId, sessionId };
  }
);
