import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";
import { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa"; // Warning icon

export const ErrorPopup = ({ open, onClose, error}) => {
  if (!error) return null;

  const code = error.code || "unknown";
  const message = error.message || "unknown";
  const description = error.description || null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, color: "error.main" }}>
        <FaExclamationTriangle size={20} />
        Error
      </DialogTitle>
      <DialogContent>
        {code && (
          <Typography variant="body1">
            <strong>Code:</strong> {code}
          </Typography>
        )}
        {message && (
          <Typography variant="body1">
            <strong>Message:</strong> {message}
          </Typography>
        )}
        {description && (
          <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
            {description}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
