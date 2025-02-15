// src/components/manager/SessionsManagerListWidget.jsx
import React from "react";
import { Grid } from "@mui/material";
import { SessionItem } from "./SessionItem";

/**
 * SessionsManagerListWidget
 *
 * Renders the list of sessions in a 2-column layout using MUI Grid.
 * Props:
 *  - sessions: array of session objects
 *  - onEditMessages: func(sessionId)
 *  - onEditDocuments: func(sessionId)
 *  - onEditFunctions: func(sessionId)
 *  - onDeleteSession: func(sessionId)
 *  - getMessageCount, getDocumentCount, getFunctionCount: optional counters
 */
export const SessionsManagerListWidget = ({
  sessions,
  onEditMessages,
  onEditDocuments,
  onEditFunctions,
  onDeleteSession,
  getMessageCount,
  getDocumentCount,
  getFunctionCount
}) => {
  if (!sessions || sessions.length === 0) {
    return null; // or a <Typography>No sessions</Typography>
  }

  return (
    <Grid container rowSpacing={2} columnSpacing={2}>
      {sessions.map((session) => (
        <Grid
          key={session.session_id}
          item
          xs={12}
          md={12}
          lg={6}
          xl={4}
        >
          <SessionItem
            session={session}
            onEditMessages={onEditMessages}
            onEditDocuments={onEditDocuments}
            onEditFunctions={onEditFunctions}
            onDeleteSession={onDeleteSession}
            msgCount={getMessageCount(session)}
            docCount={getDocumentCount(session)}
            funcCount={getFunctionCount(session)}
          />
        </Grid>
      ))}
    </Grid>
  );
};