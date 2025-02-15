// src/components/tools/SessionToolsWidget.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  Typography,
  CircularProgress
} from "@mui/material";
import { useDispatch } from "react-redux";
import apiClient from "../../../apiClient";
import { SessionTool } from "./SessionTool";

/**
 * SessionToolsWidget
 *
 * Shows all tools, with an attach/detach toggle for the current session.
 *
 * Props:
 *  - open (bool) => whether this widget is visible
 *  - onClose (func) => called to close
 *  - sessionId (string) => ID of the current session
 */
export const SessionToolsWidget = ({ open, onClose, sessionId }) => {
  const dispatch = useDispatch(); // if needed for other actions
  const [loading, setLoading] = useState(false);
  const [tools, setTools] = useState([]);       // array of all tools
  const [attachedMap, setAttachedMap] = useState({}); // toolId => bool

  useEffect(() => {
    if (!open || !sessionId) return;
    // 1) fetch all tools
    setLoading(true);
    apiClient.get("/tools/list")
      .then((res) => {
        const allTools = res.data; // [ { id, name, description, rules, sessions: [...] }, ... ]
        setTools(allTools);

        // 2) Build a map: if sessions includes sessionId => attached = true
        const map = {};
        allTools.forEach((tool) => {
          const attached = tool.sessions.includes(sessionId);
          map[tool.id] = attached;
        });
        setAttachedMap(map);
      })
      .catch((err) => {
        console.error("Failed to fetch tools:", err);
      })
      .finally(() => setLoading(false));
  }, [open, sessionId]);

  const handleClose = () => {
    if (onClose) onClose();
  };

  /**
   * toggleAttach
   * Calls /tools/attach or /tools/detach, then updates local state
   */
  const toggleAttach = (toolId) => {
    const currentlyAttached = attachedMap[toolId] || false;
    const endpoint = currentlyAttached ? "/tools/detach" : "/tools/attach";
    const payload = { tool_id: toolId, session_id: sessionId };

    apiClient.post(endpoint, payload)
      .then(() => {
        setAttachedMap({ 
          ...attachedMap, 
          [toolId]: !currentlyAttached 
        });
      })
      .catch((err) => {
        console.error("Failed to toggle attach/detach:", err);
      });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Manage Tools for Session</DialogTitle>
      <DialogContent dividers sx={{ minHeight: 300 }}>
        {loading && <CircularProgress />}
        {!loading && tools.length === 0 && (
          <Typography>No tools found.</Typography>
        )}
        {!loading && tools.length > 0 && (
          <List>
            {tools.map((tool) => (
              <SessionTool
                key={tool.id}
                tool={tool}
                isAttached={attachedMap[tool.id] || false}
                onToggle={() => toggleAttach(tool.id)}
              />
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
};
