// src/features/windowManager/types/windowTypes.ts

export type WindowType = 'regular' | 'dualPane';

export interface Window {
  id: string;
  type: WindowType;
  isMinimized: boolean;
  isMaximized: boolean;
  xPos: number;
  yPos: number;
  width: number;
  height: number;
  zIndex: number;
  minimumWidth: number;
  maximumWidth: number;
  minimumHeight: number;
  maximumHeight: number;
  initialWidth: number;
  initialHeight: number;
  restoreSize: { width: number; height: number; xPos: number; yPos: number };
  dragging: boolean;
  resizing: boolean;
  resizeDirection: string;
  lastMouseX: number;
  lastMouseY: number;
}

export interface WindowsState {
  windows: Record<string, Window>;
  currentZIndex: number;
}
