import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import messageSlice from './slices/messageSlice';
import settingsSlice from './slices/settingsSlice';

export default configureStore({
  reducer: {
    user: userSlice,
    messages: messageSlice,
    settings: settingsSlice,
  },
});