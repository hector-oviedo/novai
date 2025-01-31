import { Box, Typography, Paper } from '@mui/material';
import { FaExclamationTriangle } from 'react-icons/fa';

export const ErrorMessage = ({ content }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 10,
          maxWidth: '75%',
          bgcolor: 'error.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <FaExclamationTriangle size={20} />
        <Typography variant="body1">{content[0].value}</Typography>
      </Paper>
    </Box>
  );
};
