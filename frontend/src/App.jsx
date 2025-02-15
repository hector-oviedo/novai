// App.jsx
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { SessionExpiredDialog } from "./components/common/SessionExpiredDialog";

import { checkAuth } from "./slices/userThunks";
import { LoginPage } from "./components/auth/LoginPage";
import { RegisterPage } from "./components/auth/RegisterPage";
import { SettingsWidget } from "./components/settings/SettingsWidget";
import { ChatPage } from "./components/chat/ChatPage";
import { DocumentsWidget } from "./components/documents/DocumentsWidget";
import { ToolsWidget } from "./components/tools/ToolsWidget";
import { SessionsManagerWidget } from "./components/manager/SessionsManagerWidget";
import { HomeWidget } from "./components/common/HomeWidget";

export const App = () => {
  const dispatch = useDispatch();
  const { logged } = useSelector((state) => state.user);

  const [activePage, setActivePage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    // If localStorage says "logged=true", we try to confirm with the server
    const storedLogged = localStorage.getItem("logged") === "chat";
    if (storedLogged) {
      setIsLoggedIn(true);
      // Attempt to confirm session
      dispatch(checkAuth())
        .unwrap()
        .then((profile) => {
          // If success => user is indeed valid
        })
        .catch(() => {
          // If 401 => the interceptor sets sessionExpired => do nothing
        });
    }
  }, [dispatch]);

  // Keep isLoggedIn in sync with Redux 'logged'
  useEffect(() => {
    setIsLoggedIn(logged);
  }, [logged]);

  return (
    <>
      {isLoggedIn ? (
        <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
          <SettingsWidget setActivePage={setActivePage} activePage={activePage} />
          <Box sx={{ display: "flex", width: "100%", height: "100vh" }}>
            <Box sx={{ flex: 1, padding: 2 }}>
              {activePage === "home" && <HomeWidget/>}
              {activePage === "chat" && <ChatPage />}
              {activePage === "sessions" && <SessionsManagerWidget />}
              {activePage === "documents" && <DocumentsWidget />}
              {activePage === "tools" && <ToolsWidget />}
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          {showLogin ? (
            <LoginPage toggleAuth={() => setShowLogin(false)} />
          ) : (
            <RegisterPage toggleAuth={() => setShowLogin(true)} />
          )}
        </Box>
      )}

      {/* SessionExpiredDialog always rendered so it can pop up if sessionExpired===true */}
      <SessionExpiredDialog />
    </>
  );
};