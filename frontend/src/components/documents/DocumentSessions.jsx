import { Box, Chip, IconButton } from "@mui/material";
import { FaTimes } from "react-icons/fa";

export const DocumentSessions = ({ sessions, documentId }) => {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {sessions.map((session) => (
        <Chip
          key={session}
          label={session}
          onDelete={() => console.log("Detach", documentId, session)}
          deleteIcon={<FaTimes />}
          color="primary"
        />
      ))}
    </Box>
  );
};
