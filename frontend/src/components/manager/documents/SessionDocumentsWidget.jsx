// src/components/documents/SessionDocumentsWidget.jsx
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
import apiClient from "../../../apiClient";
import { SessionDocument } from "./SessionDocument";

/**
 * SessionDocumentsWidget
 *
 * A dialog listing all documents. 
 * Checks whether each doc is attached to the given sessionId 
 * and shows a toggle (Attach/Detach).
 *
 * Props:
 *  - open: boolean => is dialog visible?
 *  - onClose: function => close the dialog
 *  - sessionId: string => ID of the session we're attaching docs to
 */
export const SessionDocumentsWidget = ({ open, onClose, sessionId }) => {
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState([]);           // all documents
  const [attachedMap, setAttachedMap] = useState({}); // docId => boolean

  useEffect(() => {
    if (!open || !sessionId) return;
    setLoading(true);

    // 1) Fetch all documents
    apiClient.get("/documents/list")
      .then((res) => {
        const allDocs = res.data; // [ { id, name, description, content, sessions: [...]}, ... ]
        setDocs(allDocs);

        // 2) Build a map: docId => true if doc.sessions includes sessionId
        const map = {};
        allDocs.forEach((doc) => {
          const isAttached = doc.sessions.includes(sessionId);
          map[doc.id] = isAttached;
        });
        setAttachedMap(map);
      })
      .catch((err) => {
        console.error("Failed to fetch documents:", err);
      })
      .finally(() => setLoading(false));
  }, [open, sessionId]);

  const handleClose = () => {
    if (onClose) onClose();
  };

  /**
   * toggleAttach
   * Calls /documents/attach or /documents/detach 
   * then flips boolean in attachedMap
   */
  const toggleAttach = (docId) => {
    const currentlyAttached = attachedMap[docId] || false;
    const endpoint = currentlyAttached ? "/documents/detach" : "/documents/attach";
    const payload = { doc_id: docId, session_id: sessionId };

    apiClient.post(endpoint, payload)
      .then(() => {
        setAttachedMap({
          ...attachedMap,
          [docId]: !currentlyAttached
        });
      })
      .catch((err) => {
        console.error("Failed to toggle doc attach/detach:", err);
      });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Manage Documents for Session</DialogTitle>
      <DialogContent dividers sx={{ minHeight: 300 }}>
        {loading && <CircularProgress />}
        {!loading && docs.length === 0 && (
          <Typography>No documents found.</Typography>
        )}
        {!loading && docs.length > 0 && (
          <List>
            {docs.map((doc) => (
              <SessionDocument
                key={doc.id}
                doc={doc}
                isAttached={attachedMap[doc.id] || false}
                onToggle={() => toggleAttach(doc.id)}
              />
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
