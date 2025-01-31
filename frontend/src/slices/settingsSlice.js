import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  return localStorage.getItem('darkMode') === 'true' ? true : false;
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    darkMode: getInitialTheme(),
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode);
    },
  },
});

export const { toggleDarkMode } = settingsSlice.actions;
export default settingsSlice.reducer;