import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';
import { lightTheme, darkTheme } from './theme';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import store from './store';
import { App } from './App.jsx';

function Root() {
  const darkMode = useSelector((state) => state.settings.darkMode);

  return (
    <StrictMode>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Root />
  </Provider>
);