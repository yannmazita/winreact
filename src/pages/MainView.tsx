// src/views/MainView.tsx

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createWindow, selectWindows } from '../features/windowManager/store/windowsSlice';
import AppWindow from '../features/windowManager/components/AppWindow';
import DualPaneWindow from '../features/windowManager/components/DualPaneWindow';

const MainView: React.FC = () => {
  const dispatch = useDispatch();
  const windows = useSelector(selectWindows);

  const handleCreateRegularWindow = () => {
    dispatch(createWindow({ type: 'regular' }));
  };

  const handleCreateDualPaneWindow = () => {
    dispatch(createWindow({ type: 'dualPane' }));
  };

  return (
    <div className="relative size-full overflow-hidden">
      <div className="p-4 space-x-4">
        <button
          onClick={handleCreateRegularWindow}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'>
          Open Regular Window
        </button>
        <button
          onClick={handleCreateDualPaneWindow}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'>
          Open Dual Pane Window
        </button>
      </div>
      <div id="window-container" className="relative w-full h-full">
        {Object.entries(windows).map(([id, window]) => {
          if (window.type === 'dualPane') {
            return (
              <DualPaneWindow
                key={id}
                id={id}
                dualPaneContent={[
                  { label: 'Pane 1', content: <div>Content for Pane 1</div> },
                  { label: 'Pane 2', content: <div>Content for Pane 2</div> },
                ]}
              />
            );
          } else {
            return (
              <AppWindow key={id} id={id}>
                <div>Regular window content</div>
              </AppWindow>
            );
          }
        })}
      </div>
    </div>
  );
};

export default MainView;
