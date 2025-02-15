import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../apiClient";

/**
 * SIGN UP: calls POST /auth/register
 * The backend sets a secure HttpOnly cookie, 
 * we do NOT store the token ourselves. 
 */
export const signUpUser = createAsyncThunk(
  "user/signUpUser",
  async ({ username, password, email }, { rejectWithValue }) => {
    if (!username || !password) {
      return rejectWithValue({
        code: "400",
        message: "Invalid Input",
        description: "Username and password are required.",
      });
    }
    try {
      const response = await apiClient.post("/auth/register", {
        username,
        password,
        email,
      });
      return response.data; // e.g. { message, user_id }
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * LOGIN: calls POST /auth/login
 * The server sets the HttpOnly cookie. We do not see the token 
 * but do store user_id if the server returns it in JSON.
 */
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/login", { username, password });
      // e.g. { access_token, token_type, user_id } or { user_id } if you want it
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * LOGOUT: calls a /auth/logout if you want the server to clear the cookie
 * or you can just expire it. 
 */
export const logoutUser = createAsyncThunk("user/logoutUser", async () => {
  await apiClient.post("/auth/logout");
  return {};
});

/**
 * Example universal error handler 
 */
function handleApiError(error) {
  if (error.response && error.response.data) {
    const err = error.response.data;
    return {
      code: err.code || "500",
      message: err.message || "Unknown Error",
      description: err.detail || "No additional info",
    };
  }
  return {
    code: "500",
    message: "Internal Client Error",
    description: "Unexpected error",
  };
}

export const checkAuth = createAsyncThunk("user/checkAuth", async (_, { rejectWithValue }) => {
  try {
    const resp = await apiClient.get("/auth/profile");
    // returns { user_id, username, email } if valid
    return resp.data;
  } catch (error) {
    return rejectWithValue("Not authenticated");
  }
});
