// src/components/manager/SessionItem.jsx
import React, { useState } from "react";
import { Paper, Typography, Box, IconButton, Divider, Button } from "@mui/material";
import { FaEdit, FaRegFileAlt, FaTrashAlt } from "react-icons/fa";
import { IoConstructOutline } from "react-icons/io5";
import { SessionToolsWidget } from "./tools/SessionToolsWidget";
import { SessionDocumentsWidget } from "./documents/SessionDocumentsWidget";

/**
 * SessionItem
 *
 * Renders a single session info, plus 4 actions at the bottom (horizontal):
 *  - Edit messages
 *  - Documents
 *  - Functions
 *  - Remove
 *
 * Props:
 *  - session: { session_id, title }
 *  - msgCount, docCount, funcCount
 *  - onEditMessages(sessionId)
 *  - onEditDocuments(sessionId)
 *  - onEditFunctions(sessionId)
 *  - onDeleteSession(sessionId)
 */
export const SessionItem = ({
  session,
  msgCount,
  docCount,
  funcCount,
  onEditMessages,
  onEditDocuments,
  onEditFunctions,
  onDeleteSession
}) => {
  const [showDocs, setShowDocs] = useState(false);
  const [showTools, setShowTools] = useState(false);

  const handleEditMessages = () => onEditMessages(session.session_id);
  const handleEditDocs = () => onEditDocuments(session.session_id);
  const handleEditFuncs = () => onEditFunctions(session.session_id);
  const handleDelete = () => onDeleteSession(session.session_id);

  return (
    <>
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
      elevation={3}
    >
      {/* Session Title */}
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", textAlign:'center', p: 1 }}>
        {session.title || "Untitled Session"}
      </Typography>

      <Divider/>

      {/* Some summary row (optional) */}
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
        <Typography variant="body2">
          Messages: {msgCount}
        </Typography>
        <Typography variant="body2">
          Docs: {docCount}
        </Typography>
        <Typography variant="body2">
          Tools: {funcCount}
        </Typography>
      </Box>

      <Divider/>

      {/* Bottom row of actions, horizontally spaced */}
      <Box sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        mt: "auto",
        pt:1
      }}>
        {/* MESSAGES */}
        <Button sx={{fontSize:'10px'}} color="success" startIcon={<FaEdit />} onClick={handleEditMessages}>
          Messages
        </Button>

        {/* DOCUMENTS */}
        <Button sx={{fontSize:'10px'}} color="warning" startIcon={<FaRegFileAlt />} onClick={()=> { setShowDocs(true); }}>
          Documents
        </Button>

        {/* FUNCTIONS */}
        <Button sx={{fontSize:'10px'}} color="warning" startIcon={<IoConstructOutline />} onClick={()=> { setShowTools(true); }}>
          Functions
        </Button>

        {/* DELETE */}
        <Button sx={{fontSize:'10px'}} color="error" startIcon={<FaTrashAlt/>} onClick={handleDelete}>
        Remove
        </Button>
      </Box>


    </Paper>
    <SessionToolsWidget
        open={showTools}
        onClose={() => setShowTools(false)}
        sessionId={session.session_id}
       />
    <SessionDocumentsWidget
      open={showDocs}
      onClose={() => setShowDocs(false)}
      sessionId={session.session_id}
      />

    </>
  );
};
