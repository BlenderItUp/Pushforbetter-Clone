import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import programsReducer from './slices/programsSlice';
import settingsReducer from './slices/settingsSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    programs: programsReducer,
    settings: settingsReducer, // Add settings slice here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
