// src/features/windowManager/components/DefaultDualPaneWindow.tsx

import React from 'react';
import { useSelector } from 'react-redux';
import { selectWindow } from '../store/windowsSlice';
import { RootState } from '../../../store';
import { componentMap } from '../utils/componentMap';

interface DefaultDualPaneWindowProps {
  id: string;
}

const DefaultDualPaneWindow: React.FC<DefaultDualPaneWindowProps> = ({ id }) => {
  const window = useSelector((state: RootState) => selectWindow(state, id));

  if (!window?.windowProps.dualPaneContents) {
    return <div>Error: Window or dual pane contents not found</div>;
  }

  const { dualPaneContents, activePane = 0 } = window.windowProps;
  const ActivePaneComponent = componentMap[dualPaneContents[activePane].componentType];

  return (
    <div className="p-2 h-full w-full grid grid-cols-3">
      <div className="col-span-1 border border-ts-blue mr-1">
        <ul>
          {dualPaneContents.map((item, index) => (
            <li
              key={index}
              className={`cursor-pointer hover:bg-gray-100 ${index === activePane ? 'bg-blue-200' : ''}`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="content-container col-span-2">
        <ActivePaneComponent id={id} />
      </div>
    </div>
  );
};

export default DefaultDualPaneWindow;
