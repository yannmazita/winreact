// src/features/windowManager/components/DualPaneWindow.tsx

import React, { useState } from 'react';
import AppWindow from './AppWindow';

interface DualPaneContent {
  label: string;
  content: React.ReactNode;
}

interface DualPaneWindowProps {
  id: string;
  dualPaneContent: DualPaneContent[];
}

const DualPaneWindow: React.FC<DualPaneWindowProps> = ({ id, dualPaneContent }) => {
  const [activePane, setActivePane] = useState(0);

  return (
    <AppWindow id={id}>
      <div className="p-2 h-full w-full grid grid-cols-3">
        <div className="col-span-1 border border-ts-blue mr-1">
          <ul>
            {dualPaneContent.map((item, index) => (
              <li
                key={index}
                onClick={() => setActivePane(index)}
                className="cursor-pointer hover:bg-gray-100"
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="content-container col-span-2">
          {dualPaneContent[activePane]?.content}
        </div>
      </div>
    </AppWindow>
  );
};

export default DualPaneWindow;
