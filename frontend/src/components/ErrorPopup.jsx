import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";
import { FaExclamationTriangle } from "react-icons/fa"; // Warning icon

export const ErrorPopup = ({ open, onClose, error }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, color: "error.main" }}>
        <FaExclamationTriangle size={20} />
        Error
      </DialogTitle>
      <DialogContent>
        {error.code && (
          <Typography variant="body1">
            <strong>Code:</strong> {error.code}
          </Typography>
        )}
        {error.message && (
          <Typography variant="body1">
            <strong>Message:</strong> {error.message}
          </Typography>
        )}
        {error.description && (
          <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
            {error.description}
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
