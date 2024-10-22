// src/views/MainView.tsx

import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createWindow, selectWindows } from '../features/windowManager/store/windowsSlice';
import AppWindow from '../features/windowManager/components/AppWindow';
import AppDefaultWindow from '../features/windowManager/components/AppDefaultWindow';
import { RootState } from '../store';

const MainView: React.FC = () => {
  const dispatch = useDispatch();
  const windows = useSelector((state: RootState) => selectWindows(state));

  const handleCreateWindow = useCallback(() => {
    dispatch(createWindow({
    }));
  }, [dispatch]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100">
      <div className="p-4">
        <button 
          onClick={handleCreateWindow}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Open New Window
        </button>
      </div>
      <div id="window-container" className="relative w-full h-full">
        {Object.entries(windows).map(([id, window]) => (
          <AppWindow key={id} id={id}>
            <AppDefaultWindow id={id} />
          </AppWindow>
        ))}
      </div>
    </div>
  );
};

export default MainView;
