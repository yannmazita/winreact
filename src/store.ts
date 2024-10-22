// src/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import windowsReducer from '@/features/windowManager/store/windowsSlice';

export const store = configureStore({
    reducer: {
        windows: windowsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
