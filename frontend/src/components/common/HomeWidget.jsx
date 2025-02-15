import { Box, Typography } from '@mui/material';
import { VscRobot, VscTextSize } from "react-icons/vsc";

export const HomeWidget = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: 'background.default',
        borderRadius: '8px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h4" align="center" color="primary.main" sx={{ m:5 }} gutterBottom>
        Welcome!
      </Typography>

      <VscRobot size="3em" color="primary.main" sx={{ color: 'primary.main' }} />
      
      <Typography variant="body2" align="center" color="primary.main" sx={{ m:5 }} >
        Welcome to Nov.AI
      </Typography>
    </Box>
  );
};