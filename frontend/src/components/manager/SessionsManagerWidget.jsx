// src/components/manager/SessionsManagerWidget.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchSessions, deleteSession } from "../../slices/sessionsThunks";
import { ConfirmationDialog } from "../common/ConfirmationDialog";
import { SessionsManagerListWidget } from "./SessionsManagerListWidget";

/**
 * SessionsManagerWidget
 *
 * The parent that:
 *  - fetches sessions from Redux
 *  - handles local states for editing messages, attaching docs, attaching funcs
 *  - renders SessionsManagerListWidget with the sessions
 *  - shows a confirmation dialog to delete a session
 */
export const SessionsManagerWidget = () => {
  const dispatch = useDispatch();
  
  const [targetSession, setTargetSession] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { list: sessions, loading, error } = useSelector((state) => state.sessions);

  // Fetch sessions on mount
  useEffect(() => {
    dispatch(fetchSessions());
  }, [dispatch]);

  // For demonstration, you might have counters in session:
  const getMessageCount = (s) => s.msgCount || 0;
  const getDocumentCount = (s) => s.docCount || 0;
  const getFunctionCount = (s) => s.funcCount || 0;

  // Called when user clicks "Edit Messages"
  const editMessages = (sessionId) => {
    setTargetSession(sessionId);
    setShowEditMessages(true);
    // open your EditMessagesWidget etc.
  };

  // Called when user clicks "Attach Docs"
  const editDocuments = (sessionId) => {
    setTargetSession(sessionId);
    setShowAttachDocuments(true);
  };

  // Called when user clicks "Attach Functions"
  const editFunctions = (sessionId) => {
    setTargetSession(sessionId);
    setShowAttachFunctions(true);
  };

  // Called when user clicks trash icon
  const handleDeleteSessionClick = (sessionId) => {
    setTargetSession(sessionId);
    setShowDeleteConfirm(true);
  };
  const handleDeleteSessionConfirm = () => {
    if (!targetSession) return;
    dispatch(deleteSession({ sessionId: targetSession }))
      .unwrap()
      .then(() => {
        setShowDeleteConfirm(false);
        setTargetSession(null);
      })
      .catch((err) => {
        console.error("Failed to delete session:", err);
        setShowDeleteConfirm(false);
        setTargetSession(null);
      });
  };
  const handleDeleteSessionCancel = () => {
    setShowDeleteConfirm(false);
    setTargetSession(null);
  };

  return (
    <Box sx={{ p: 2 }}>

      {loading && <Typography>Loading sessions...</Typography>}
      {error && <Typography color="error">Error: {String(error)}</Typography>}
      {!loading && sessions.length === 0 && (
        <Typography>No sessions available.</Typography>
      )}

      {/* The list widget */}
      <SessionsManagerListWidget
        sessions={sessions}
        onEditMessages={editMessages}
        onEditDocuments={editDocuments}
        onEditFunctions={editFunctions}
        onDeleteSession={handleDeleteSessionClick}
        getMessageCount={getMessageCount}
        getDocumentCount={getDocumentCount}
        getFunctionCount={getFunctionCount}
      />

      {/* Confirmation dialog for delete */}
      <ConfirmationDialog
        open={showDeleteConfirm}
        title="Delete Session"
        message="Are you sure you want to delete this session? This action is irreversible."
        onClose={handleDeleteSessionCancel}
        onConfirm={handleDeleteSessionConfirm}
      />

      {/* 
        Below you might render:
          EditMessagesWidget open={showEditMessages} ...
          AttachDocumentsWidget open={showAttachDocuments} ...
          AttachFunctionsWidget open={showAttachFunctions} ...
        depending on your flow
      */}
    </Box>
  );
};
