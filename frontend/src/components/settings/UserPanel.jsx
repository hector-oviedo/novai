import { Box, Typography, IconButton, Tooltip, Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";

export const UserPanel = () => {
  const { username, profilePicture } = useSelector((state) => state.user);
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        width: "100%",
        padding: "4px 8px",
      }}
    >
      {/* Profile Picture */}
      {
      <Avatar 
        src={profilePicture || "/default-avatar.png"} 
        alt="User Profile"
        sx={{ width: 32, height: 32 }}
      />
      }
      {/* Username */}
      <Typography 
        variant="body2" 
        sx={{ fontWeight: "bold", fontSize: "12px", flexGrow: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
      >
        {username}
      </Typography>
    </Box>
  );
};
