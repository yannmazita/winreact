// src/features/windowManager/components/componentMap.ts

import React from 'react';
import { WindowComponentType } from '../types/windowInterfaces';
import DefaultWindow from '../components/DefaultWindow';
import DefaultDualPaneWindow from '../components/DefaultDualPaneWindow';

export const componentMap: Record<WindowComponentType, React.ComponentType<any>> = {
  default: DefaultWindow,
  defaultDualPane: DefaultDualPaneWindow,
  custom: () => null, // Placeholder for custom components
};
