import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2', border:'#ccc' },
    secondary: { main: '#1976d2' },
    background: { default: '#fafafa' },
    sessionsSide: { bubbleBackground:'#f5f5f5', bubbleBackgroundSelected:'#e3f2fd', color:'#000', colorSelected:'#000' },
    nav: { background:'#fff' },
    userBubble: { main: '#e3f2fd', text: '#000' },
    snippet: { background: '#f5f5f5', text: '#333' },
    table: { background: '#fff', text: '#000', border: '#ddd' },
    think: { background: '#f5f5f5', text: '#333', border: '#ddd' },
    popupBackground: "#fff",
    popupText: "#000",
    uploadWidget: { background: "#e3f2fd", border: "#1976d2", text: "#1976d2", hover: "#bbdefb" },
    sessions: {
      background: '#fff',
      border: '#ccc',
      scrollbarTrack: 'rgba(0, 0, 0, 0.1)',
      scrollbarThumb: '#1976d2',
      scrollbarThumbHover: '#1565c0',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9', border:'#555' },
    secondary: { main: '#90caf9' },
    background: { default: '#121212' },
    sessionsSide: { bubbleBackground:'#121212', bubbleBackgroundSelected:'#90caf9', color:'#fff', colorSelected:'#000' },
    nav: { background:'#121212'},
    userBubble: { main: '#516e86', text: '#fff' },
    snippet: { background: '#263238', text: '#eceff1' },
    table: { background: '#1e1e1e', text: '#ffffff', border: '#555' },
    think: { background: '#333', text: '#eceff1', border: '#222' },
    popupBackground: "#121212",
    popupText: "#fff",
    uploadWidget: { background: "#263238", border: "#90caf9", text: "#90caf9", hover: "#37474f" },
    sessions: {
      background: '#1e1e1e',
      border: '#555',
      scrollbarTrack: 'rgba(255, 255, 255, 0.1)',
      scrollbarThumb: '#90caf9',
      scrollbarThumbHover: '#75a4ef',
    },
  },
});