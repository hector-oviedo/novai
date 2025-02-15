import { createSlice } from "@reduxjs/toolkit";
import { loginUser, signUpUser, logoutUser } from "./userThunks";

// Load user data from localStorage
const storedUserId = localStorage.getItem("userId");
const storedUsername = localStorage.getItem("username");
const storedLogged = localStorage.getItem("logged") === "true";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: storedUserId || null,
    username: storedUsername || "",
    logged: storedLogged,
    sessionExpired: false,
  },
  reducers: {
    logout: (state) => {
      state.userId = null;
      state.username = "";
      state.logged = false;
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      localStorage.removeItem("logged");
    },
    localLogout: (state) => {
      state.userId = null;
      state.username = "";
      state.logged = false;
      state.plugins = [];
      state.sessionExpired = false; // also reset
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      localStorage.removeItem("logged");
    },
    sessionExpired: (state) => {
      // Called if the server returns 401 => session token invalid
      state.sessionExpired = true;
    },
    dismissSessionExpired: (state) => {
      // Resets the flag
      state.sessionExpired = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userId = action.payload.user_id;
        state.username = action.payload.username;
        state.logged = true;
        localStorage.setItem("userId", action.payload.user_id);
        localStorage.setItem("username", action.payload.username);
        localStorage.setItem("logged", "true");
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.userId = action.payload.user_id;
        state.username = action.payload.username;
        state.logged = true;
        localStorage.setItem("userId", action.payload.user_id);
        localStorage.setItem("username", action.payload.username);
        localStorage.setItem("logged", "true");
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.userId = null;
        state.username = "";
        state.logged = false;
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.removeItem("logged");
      });
  },
});

export const { logout, localLogout, sessionExpired, dismissSessionExpired } = userSlice.actions;
export default userSlice.reducer;
