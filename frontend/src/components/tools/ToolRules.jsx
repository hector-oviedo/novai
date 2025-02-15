import { Typography, Paper, IconButton } from '@mui/material';
import { FaCopy } from 'react-icons/fa';
import { useTheme } from '@mui/material/styles';

export const ToolRules = ({ content }) => {
  const theme = useTheme();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        bgcolor: theme.palette.snippet.background,
        color: theme.palette.snippet.text,
        mt: 1,
        position: 'relative',
        overflowX: 'auto',
      }}
    >
      <Typography
        ariant="caption"
        sx={{
          display: 'inline-block',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          fontSize:'12px',
          lineHeight:'1',
          }}>{content}</Typography>
      <IconButton
        onClick={copyToClipboard}
        sx={{ position: 'absolute', top: 5, right: 5 }}
      >
        <FaCopy size={16} />
      </IconButton>
    </Paper>
  );
};
