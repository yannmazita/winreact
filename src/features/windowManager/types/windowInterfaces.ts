// src/features/windowManager/types/windowTypes.ts

export type WindowComponentType = 'default' | 'defaultDualPane' | 'custom';

export interface WindowDualPaneContent {
  label: string;
  componentType: WindowComponentType;
}

export interface Window {
  id: string;
  windowComponentType: WindowComponentType;
  windowProps: {
    id?: string;
    dualPaneContents?: WindowDualPaneContent[];
    [key: string]: any;
  };
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
