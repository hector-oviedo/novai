// src/components/manager/SessionItem.jsx
import { Box, Typography, IconButton } from "@mui/material";
import { FaTrashAlt } from "react-icons/fa";

export const SessionItem = ({ session, isActive, onClick, onDelete }) => {
  const handleMainClick = () => {
    if (onClick) onClick(session.session_id);
  };

  const handleDeleteClick = (e) => {
    // stop event so it doesn't trigger onClick
    e.stopPropagation(); 
    if (onDelete) onDelete(session.session_id);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // separate title & trash icon
        bgcolor: isActive ? "sessionsSide.bubbleBackgroundSelected" : "sessionsSide.bubbleBackground",
        color : isActive ? "sessionsSide.colorSelected" : "sessionsSide.color",
        p: 1,
        borderRadius: "16px",
        cursor: "pointer",
        mb: 1,
        transition: "background 0.3s",
        "&:hover": {
          bgcolor: isActive ? "sessionsSide.bubbleBackgroundSelected" : "sessionsSide.bubbleBackground",
        },
      }}
      onClick={handleMainClick}
    >
      <Typography variant="body2">
        {session.title || session.session_id}
      </Typography>

      {/* Trash icon at the far right */}
      <IconButton
        size="small"
        color="error"
        onClick={handleDeleteClick}
        sx={{ ml: 2 }}
      >
        <FaTrashAlt />
      </IconButton>
    </Box>
  );
};