// src/features/windowManager/utils/createDualPaneWindow.ts

import { createWindow } from '../store/windowsSlice';
import { WindowComponentType, WindowDualPaneContent } from '../types/windowInterfaces';
import { AppDispatch } from '../../../store';

/**
  * Creates a new window with a dual pane layout.
  * @param dispatch - The Redux dispatch function.
  * @param initialComponentType - The initial component type for the window.
  * @param dualPaneContents - An array of dual pane content objects.
  * @param additionalProps - Additional props to pass to the window.
  */
export const createDualPaneWindow = (
  dispatch: AppDispatch,
  initialComponentType: WindowComponentType,
  dualPaneContents: WindowDualPaneContent[],
  additionalProps: Record<string, any> = {}
) => {
  dispatch(createWindow({
    windowComponentType: initialComponentType,
    windowProps: {
      dualPaneContents,
      activePane: 0,
      ...additionalProps
    }
  }));
};
