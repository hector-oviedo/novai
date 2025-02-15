// src/components/common/SessionExpiredDialog.jsx
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { localLogout } from "../../slices/userSlice";

export const SessionExpiredDialog = () => {
  const dispatch = useDispatch();
  const sessionExpired = useSelector((state) => state.user.sessionExpired);

  const handleClose = () => {
    // Option 1: Force a logout
    dispatch(localLogout());
  };

  return (
    <Dialog open={sessionExpired} onClose={handleClose}>
      <DialogTitle>Session Timed Out</DialogTitle>
      <DialogContent>
        <Typography sx={{textAlign:'center'}}>Session expired.</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={handleClose}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};
