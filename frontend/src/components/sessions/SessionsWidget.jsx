// src/components/manager/SessionsWidget.jsx
import { Box, Typography, useTheme, IconButton, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSessions, fetchSessionById, deleteSession } from "../../slices/sessionsThunks";
import { setCurrentSession } from "../../slices/sessionsSlice";
import { SessionItem } from "./SessionItem";
import { FaPlus } from "react-icons/fa";
import { ConfirmationDialog } from "../common/ConfirmationDialog";
import { SessionCreateWidget } from "../common/SessionCreateWidget";

export const SessionsWidget = ({ setActivePage, activePage }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { list, currentSession, loading, error } = useSelector((state) => state.sessions);

  // For the "SessionCreateWidget"
  const [showCreateWidget, setShowCreateWidget] = useState(false);

  // For "delete session" confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [targetSessionId, setTargetSessionId] = useState(null);

  useEffect(() => {
    dispatch(fetchSessions());
  }, [dispatch]);

  // When user clicks the plus icon -> show create widget
  const handleCreateNewSession = () => {
    setShowCreateWidget(true);
  };

  // Called by SessionCreateWidget if creation is successful
  const handleSessionCreated = (newSession) => {
    // newSession => { session_id, title }
    // Optionally set it as current session, fetch messages, go to chat
    dispatch(setCurrentSession(newSession));
    dispatch(fetchSessionById({ sessionId: newSession.session_id }));
    if (setActivePage) {
      setActivePage("chat");
    }
  };

  // Selecting a session for chat
  const handleSelectSession = (sessionId) => {
    const found = list.find((s) => s.session_id === sessionId);
    if (found) {
      dispatch(setCurrentSession(found));
      // fetch messages
      dispatch(fetchSessionById({ sessionId: found.session_id }));
      if (setActivePage) {
        setActivePage("chat");
      }
    }
  };

  // Deleting a session
  const handleDeleteSessionClick = (sessionId) => {
    setTargetSessionId(sessionId);
    setShowDeleteConfirm(true);
  };
  const handleDeleteSessionConfirm = () => {
    if (!targetSessionId) return;
    dispatch(deleteSession({ sessionId: targetSessionId }))
      .unwrap()
      .then(() => {
        setShowDeleteConfirm(false);
        setTargetSessionId(null);
        setActivePage("home");
      })
      .catch((err) => {
        console.error("Failed to delete session:", err);
        setShowDeleteConfirm(false);
        setTargetSessionId(null);
      });
  };
  const handleDeleteSessionCancel = () => {
    setShowDeleteConfirm(false);
    setTargetSessionId(null);
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.sessions.background,
        borderRadius: "25px",
        borderBottomRightRadius: "0px",
        borderBottomLeftRadius: "0px",
      }}
    >
      {/* 1) Header Row */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1 }}>
        <Typography variant="body2" sx={{ textAlign: "center", width:'100%' }}>Chat History</Typography>
        <IconButton size="small" onClick={handleCreateNewSession}>
          <FaPlus />
        </IconButton>
      </Box>

      {/* 2) The sessions list */}
      <Box
        sx={{
          width: "100%",
          maxHeight: "40vh",
          overflowY: "auto",
          padding: theme.spacing(1),
          scrollbarWidth: "thin",
          scrollbarColor: `${theme.palette.sessions.scrollbarThumb} ${theme.palette.sessions.scrollbarTrack}`,
        }}
        css={{
          "&::-webkit-scrollbar": { width: "8px !important" },
          "&::-webkit-scrollbar-track": { backgroundColor: theme.palette.sessions.scrollbarTrack },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.sessions.scrollbarThumb,
            borderRadius: "8px",
            border: "2px solid transparent",
            backgroundClip: "content-box",
            "&:hover": {
              backgroundColor: theme.palette.sessions.scrollbarThumbHover,
            },
          },
        }}
      >
        {loading && <Typography variant="body2">Loading...</Typography>}
        {error && <Typography variant="body2" color="error">{String(error)}</Typography>}

        {!loading && list.length === 0 && (
          <>
            <br/>
            
            <br />
          </>
        )}

        {/* Render each session bubble */}
        {list.map((sess) => (
          <SessionItem
            key={sess.session_id}
            session={sess}
            isActive={currentSession?.session_id === sess.session_id && activePage === "chat"}
            onClick={handleSelectSession}
            onDelete={handleDeleteSessionClick}
          />
        ))}
      </Box>

      {/* 3) Confirmation to delete a session */}
      <ConfirmationDialog
        open={showDeleteConfirm}
        title="Delete Session"
        message="Are you sure you want to delete this session? This action is irreversible."
        onClose={handleDeleteSessionCancel}
        onConfirm={handleDeleteSessionConfirm}
      />

      {/* 4) Our new SessionCreateWidget for adding a session */}
      <SessionCreateWidget
        open={showCreateWidget}
        onClose={() => setShowCreateWidget(false)}
        onSessionCreated={handleSessionCreated}
      />
    </Box>
  );
};
