import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#f50057' },
    background: { default: '#fafafa' },
    userBubble: { main: '#e3f2fd', text: '#000' },
    snippet: { background: '#f5f5f5', text: '#333' },
    table: { background: '#fff', text: '#000', border: '#ddd' },
    think: { background: '#f5f5f5', text: '#333', border: '#ddd' },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    secondary: { main: '#f48fb1' },
    background: { default: '#121212' },
    userBubble: { main: '#516e86', text: '#fff' },
    snippet: { background: '#263238', text: '#eceff1' },
    table: { background: '#1e1e1e', text: '#ffffff', border: '#555' },
    think: { background: '#333', text: '#eceff1', border: '#222' },
  },
});