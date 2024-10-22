// src/features/windowManager/types/windowTypes.ts

export interface Window {
  id: string;
  isMinimized: boolean;
  isMaximized: boolean;
  windowComponent: React.ComponentType<any>;
  windowComponentKey: string;
  xPos: number;
  yPos: number;
  minimumWidth: number;
  maximumWidth: number;
  minimumHeight: number;
  maximumHeight: number;
  initialWidth: number;
  initialHeight: number;
  restoreSize: { width: number; height: number; xPos: number; yPos: number };
  windowProps: Record<string, any>;
  dragging: boolean;
  resizing: boolean;
  resizeDirection: string;
  lastMouseX: number;
  lastMouseY: number;
  width: number;
  height: number;
  zIndex: number;
}

export interface WindowDualPaneContent {
  label: string;
  component: React.ComponentType<any>;
}

export interface WindowsState {
  windows: Record<string, Window>;
  currentZIndex: number;
}
