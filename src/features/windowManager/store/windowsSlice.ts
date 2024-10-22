// src/features/windowManager/store/windowsSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Window, WindowDualPaneContent, WindowsState } from '../types/windowInterfaces';

const initialState: WindowsState = {
  windows: {},
  currentZIndex: 100,
};

const windowsSlice = createSlice({
  name: 'windows',
  initialState,
  reducers: {
    createWindow: (state, action: PayloadAction<Partial<Window>>) => {
      const id = uuidv4();
      const newWindow: Window = {
        id,
        isMinimized: false,
        isMaximized: false,
        xPos: 100,
        yPos: 100,
        width: 800,
        height: 600,
        minimumWidth: 320,
        maximumWidth: 1024,
        minimumHeight: 240,
        maximumHeight: 768,
        initialWidth: 800,
        initialHeight: 600,
        restoreSize: { width: 640, height: 480, xPos: 100, yPos: 100 },
        windowProps: { id },
        dragging: false,
        resizing: false,
        resizeDirection: '',
        lastMouseX: 0,
        lastMouseY: 0,
        zIndex: state.currentZIndex++,
        ...action.payload,
      };
      state.windows[id] = newWindow;
    },
    closeWindow: (state, action: PayloadAction<string>) => {
      delete state.windows[action.payload];
    },
    updateWindow: (state, action: PayloadAction<{ id: string; updates: Partial<Window> }>) => {
      const { id, updates } = action.payload;
      if (state.windows[id]) {
        state.windows[id] = { ...state.windows[id], ...updates };
      }
    },
    maximizeWindow: (state, action: PayloadAction<string>) => {
      const window = state.windows[action.payload];
      if (window) {
        if (!window.isMaximized) {
          window.restoreSize = { width: window.width, height: window.height, xPos: window.xPos, yPos: window.yPos };
          window.isMaximized = true;
        } else {
          window.width = window.restoreSize.width;
          window.height = window.restoreSize.height;
          window.xPos = window.restoreSize.xPos;
          window.yPos = window.restoreSize.yPos;
          window.isMaximized = false;
        }
      }
    },
    minimizeWindow: (state, action: PayloadAction<string>) => {
      const window = state.windows[action.payload];
      if (window) {
        window.isMinimized = !window.isMinimized;
      }
    },
    focusWindow: (state, action: PayloadAction<string>) => {
      const window = state.windows[action.payload];
      if (window) {
        const highestZIndex = Math.max(...Object.values(state.windows).map(w => w.zIndex)) + 1;
        window.zIndex = highestZIndex;
        state.currentZIndex = highestZIndex + 1;
      }
    },
  },
});

export const {
  createWindow,
  closeWindow,
  updateWindow,
  maximizeWindow,
  minimizeWindow,
  focusWindow,
} = windowsSlice.actions;

export default windowsSlice.reducer;

// Selectors
export const selectWindows = (state: { windows: WindowsState }) => state.windows.windows;
export const selectWindow = (state: { windows: WindowsState }, id: string) => state.windows.windows[id];
export const selectDualPaneContent = (state: { windows: WindowsState }, id: string) => {
  const window = state.windows.windows[id];
  return window?.windowProps?.dualPaneContents as WindowDualPaneContent[] | undefined;
};
