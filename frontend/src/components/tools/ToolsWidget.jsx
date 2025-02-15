import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTools } from "../../slices/toolsThunks";
import { ToolsList } from "./ToolsList";
import { Box, Typography, CircularProgress } from "@mui/material";

export const ToolsWidget = () => {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.user);
  const { tools, loading, error } = useSelector((state) => state.tools);

  useEffect(() => {
    if (userId) {
      dispatch(fetchTools(userId));
    }
  }, [dispatch, userId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!tools || tools.length === 0) return <Typography>No function tools available.</Typography>;

  return (
    <Box  sx={{width:'100%'}}>
      <ToolsList tools={tools} />
    </Box>
  );
};