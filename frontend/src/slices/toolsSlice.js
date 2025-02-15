import { createSlice } from "@reduxjs/toolkit";
import { fetchTools, attachTool, detachTool } from "./toolsThunks";

export const toolsSlice = createSlice({
  name: "tools",
  initialState: {
    tools: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTools.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTools.fulfilled, (state, action) => {
        state.loading = false;
        state.tools = action.payload;
      })
      .addCase(fetchTools.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(attachTool.fulfilled, (state, action) => {
        const { toolId, sessionId } = action.payload;
        state.tools = state.tools.map((tool) =>
          tool.id === toolId
            ? { ...tool, sessions: [...tool.sessions, sessionId] }
            : tool
        );
      })
      .addCase(detachTool.fulfilled, (state, action) => {
        const { toolId, sessionId } = action.payload;
        state.tools = state.tools.map((tool) =>
          tool.id === toolId
            ? { ...tool, sessions: tool.sessions.filter((id) => id !== sessionId) }
            : tool
        );
      });
  },
});

export default toolsSlice.reducer;