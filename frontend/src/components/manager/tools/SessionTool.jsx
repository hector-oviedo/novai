// src/components/tools/SessionTool.jsx
import React from "react";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  ListItemIcon,
  Typography
} from "@mui/material";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

/**
 * SessionTool
 *
 * Displays:
 *  - Icon indicating attached or not (green check or red slash).
 *  - Tool name & description in text.
 *  - Attach/Detach button on the right side.
 *
 * Props:
 *  - tool: { id, name, description, rules, sessions[] }
 *  - isAttached: bool => if the current session has it attached
 *  - onToggle: func => calls attach or detach
 */
export const SessionTool = ({ tool, isAttached, onToggle }) => {
  return (
    <ListItem divider>
      {/* Status icon on the left */}
      <ListItemIcon>
        {isAttached ? (
          <FaCheckCircle color="green" />
        ) : (
          <FaTimesCircle color="orange" />
        )}
      </ListItemIcon>

      {/* Main text: tool name + description */}
      <ListItemText
        primary={
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {tool.name}
          </Typography>
        }
        secondary={tool.description}
      />

      {/* Attach/Detach button on the right side */}
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
