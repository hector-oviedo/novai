// src/components/common/SessionCreateWidget.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createSession } from "../../slices/sessionsThunks";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";

export const SessionCreateWidget = ({
  open,
  onClose,
  onSessionCreated
}) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");

  const handleCancel = () => {
    setTitle("");
    onClose();
  };

  const handleConfirmCreate = () => {
    dispatch(createSession({ title }))
      .unwrap()
      .then((newSession) => {
        // newSession => { session_id, title }
        setTitle("");
        if (onSessionCreated) {
          onSessionCreated(newSession);
        }
        onClose();
      })
      .catch((err) => {
        console.error("Failed to create session:", err);
        // optionally show an error
      });
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Create New Session</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Session Title"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleConfirmCreate} variant="contained" disabled={!title.trim()}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};