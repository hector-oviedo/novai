// src/apiClient.js
import axios from "axios";
import store from "./store"; // your configureStore
import { sessionExpired } from "./slices/userSlice"; // the new action

const apiClient = axios.create({
  baseURL: "http://localhost:8000", 
  withCredentials: true,
});

// Request interceptor (optional)
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 1) Only dispatch sessionExpired if user is "logged" in Redux
      const { user } = store.getState();
      if (user.logged) {
        store.dispatch(sessionExpired());
      }
      // Otherwise, they're not logged in => It's just an auth error 
      // (e.g. wrong password), so do nothing special.
    }
    return Promise.reject(error);
  }
);

export default apiClient;
