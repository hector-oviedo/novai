import { Box, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const UserMessage = ({ content }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
      <Paper
        elevation={3}
        sx={{
          bgcolor: theme.palette.userBubble.main,
          color: theme.palette.userBubble.text,
          p: 2,
          borderRadius: 10,
          maxWidth: '75%',
        }}
      >
        {
          <Typography variant="body1">{content}</Typography>
        }
      </Paper>
    </Box>
  );
};
