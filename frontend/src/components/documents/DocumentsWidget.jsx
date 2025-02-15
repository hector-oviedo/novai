import { Box, Typography, CircularProgress, IconButton } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDocuments } from "../../slices/documentsThunks";
import { DocumentsList } from "./DocumentsList";
import { DocumentAdd } from "./DocumentAdd";
import { FaSync } from "react-icons/fa";

export const DocumentsWidget = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.documents);
  const { userId } = useSelector((state) => state.user);

  useEffect(() => {
    if (userId) {
      dispatch(fetchDocuments(userId));
    }
  }, [dispatch, userId]);

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <DocumentAdd />

      <Box sx={{ display: "flex", width:'100%', justifyContent: "flex-end", mb:2 }}>
        <IconButton onClick={() => dispatch(fetchDocuments(userId))} color="primary">
          <FaSync />
        </IconButton>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <DocumentsList documents={list} />
    </Box>
  );
};
