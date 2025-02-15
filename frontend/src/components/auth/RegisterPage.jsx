import { useState } from "react";
import { Button, Grid, TextField, Typography, Link } from "@mui/material";
import { AuthLayout } from "./AuthLayout";
import { useDispatch } from "react-redux";
import { signUpUser } from "../../slices/userThunks";
import { useForm } from "../../hooks/useForm";
import { ErrorPopup } from "../ErrorPopup";

export const RegisterPage = ({ toggleAuth }) => {
  const dispatch = useDispatch();
  const { username, password, email, onInputChange, onResetForm } = useForm({
    username: "",
    password: "",
    email: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Track API request status

  const isFormValid = username.trim() !== "" && password.trim() !== "";

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Disable form while waiting
    try {
      await dispatch(signUpUser({ username, password, email })).unwrap();
    } catch (err) {
      setError(err);
      onResetForm();
    } finally {
      setLoading(false); // Re-enable form after request completes
    }
  };

  return (
    <AuthLayout title="Register">
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
              type="email"
              label="E-mail (optional)"
              name="email"
              value={email}
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

          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth disabled={!isFormValid || loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </Grid>
        </Grid>

        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link component="button" onClick={toggleAuth} disabled={loading}>
              Sign in here
            </Link>
          </Typography>
        </Grid>

        <ErrorPopup open={!!error} onClose={() => setError(null)} error={error || {}} />
      </form>
    </AuthLayout>
  );
};
