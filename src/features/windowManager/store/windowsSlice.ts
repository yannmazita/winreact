// src/features/windowManager/store/windowsSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Window, WindowComponentType, WindowsState } from '../types/windowInterfaces';

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
        windowComponentType: 'default',
        windowProps: { id },
        isMinimized: false,
        isMaximized: false,
        xPos: 100,
        yPos: 100,
        width: 800,
        height: 600,
        zIndex: state.currentZIndex++,
        minimumWidth: 320,
        maximumWidth: 1024,
        minimumHeight: 240,
        maximumHeight: 768,
        initialWidth: 800,
        initialHeight: 600,
        restoreSize: { width: 800, height: 600, xPos: 100, yPos: 100 },
        dragging: false,
        resizing: false,
        resizeDirection: '',
        lastMouseX: 0,
        lastMouseY: 0,
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
          window.xPos = 0;
          window.yPos = 0;
          window.width = window.maximumWidth;
          window.height = window.maximumHeight;
        } else {
          window.isMaximized = false;
          window.width = window.restoreSize.width;
          window.height = window.restoreSize.height;
          window.xPos = window.restoreSize.xPos;
          window.yPos = window.restoreSize.yPos;
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
        window.zIndex = state.currentZIndex++;
      }
    },
    setWindowComponentType: (state, action: PayloadAction<{ id: string; componentType: WindowComponentType }>) => {
      const window = state.windows[action.payload.id];
      if (window) {
        window.windowComponentType = action.payload.componentType;
      }
    },
    setActivePane: (state, action: PayloadAction<{ id: string; paneIndex: number }>) => {
      const window = state.windows[action.payload.id];
      if (window?.windowProps.dualPaneContents) {
        window.windowProps.activePane = action.payload.paneIndex;
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
  setWindowComponentType,
  setActivePane,
} = windowsSlice.actions;

export default windowsSlice.reducer;

// Selectors
export const selectWindows = (state: { windows: WindowsState }) => state.windows.windows;
export const selectWindow = (state: { windows: WindowsState }, id: string) => state.windows.windows[id];
export const selectDualPaneContent = (state: { windows: WindowsState }, id: string) =>
  state.windows.windows[id]?.windowProps?.dualPaneContents;
