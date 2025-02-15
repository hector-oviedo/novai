import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import messageSlice from './slices/messageSlice';
import settingsSlice from './slices/settingsSlice';
import sessionsSlice from './slices/sessionsSlice';
import documentsSlice from './slices/documentsSlice';
import toolsSlice from './slices/toolsSlice';

export default configureStore({
  reducer: {
    user: userSlice,
    messages: messageSlice,
    settings: settingsSlice,
    sessions: sessionsSlice,
    documents: documentsSlice,
    tools: toolsSlice,
  },
});