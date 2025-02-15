import { useState } from "react";
import { Button, Grid, TextField, Typography, Link } from "@mui/material";
import { FaGoogle } from "react-icons/fa";
import { AuthLayout } from "./AuthLayout";
import { useDispatch } from "react-redux";
import { loginUser } from "../../slices/userThunks";
import { useForm } from "../../hooks/useForm";
import { ErrorPopup } from "../ErrorPopup";

export const LoginPage = ({ toggleAuth }) => {
  const dispatch = useDispatch();
  const { username, password, onInputChange, onResetForm } = useForm({
    username: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Track API request status

  const isFormValid = username.trim() !== "" && password.trim() !== "";

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Disable form while waiting
    try {
      await dispatch(loginUser({ username, password })).unwrap();
    } catch (err) {
      setError(err);
      onResetForm();
    } finally {
      setLoading(false); // Re-enable form after request completes
    }
  };

  return (
    <AuthLayout title="Login">
      <form onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              type="text"
              label="Username"
              name="username"
              value={username}
              onChange={onInputChange}
              fullWidth
              disabled={loading} // Disable input during request
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              type="password"
              label="Password"
              name="password"
              value={password}
              onChange={onInputChange}
              fullWidth
              disabled={loading} // Disable input during request
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button
              disabled={!isFormValid || loading} // Disable if loading
              type="submit"
              variant="contained"
              fullWidth
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button
              onClick={() => console.log("Google sign-in clicked")}
              variant="contained"
              startIcon={<FaGoogle />}
              fullWidth
              disabled={loading} // Disable Google login during request
            >
              Google
            </Button>
          </Grid>
        </Grid>

        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link component="button" onClick={toggleAuth} disabled={loading}>
              Register here
            </Link>
          </Typography>
        </Grid>
      </form>

      {/* Error Popup */}
      <ErrorPopup open={!!error} onClose={() => setError(null)} error={error || {}} />
    </AuthLayout>
  );
};
