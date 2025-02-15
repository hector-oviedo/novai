// src/components/documents/SessionDocument.jsx
import React from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Typography
} from "@mui/material";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

/**
 * SessionDocument
 *
 * Shows:
 *  - icon for attached or not
 *  - doc name + description
 *  - attach/detach button on the right
 *
 * Props:
 *  - doc: { id, name, description, content, sessions: [...] }
 *  - isAttached: bool => if the doc is attached to the current session
 *  - onToggle: function => attach or detach
 */
export const SessionDocument = ({ doc, isAttached, onToggle }) => {
  return (
    <ListItem divider>
      {/* Icon: attached => green check, else red slash */}
      <ListItemIcon>
        {isAttached ? (
          <FaCheckCircle color="green" />
        ) : (
          <FaTimesCircle color="orange" />
        )}
      </ListItemIcon>

      {/* Document name & description */}
      <ListItemText
        primary={
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {doc.name || "Untitled Document"}
          </Typography>
        }
        secondary={doc.description}
      />

      {/* Attach/Detach button */}
      <ListItemSecondaryAction>
        {isAttached ? (
          <Button variant="contained" color="warning" size="small" onClick={onToggle}>
            Detach
          </Button>
        ) : (
          <Button variant="contained" color="success" size="small" onClick={onToggle}>
            Attach
          </Button>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
};
