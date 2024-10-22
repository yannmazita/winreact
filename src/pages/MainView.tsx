// src/views/MainView.tsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createWindow, selectWindows } from '../features/windowManager/store/windowsSlice';
import Window from '@/features/windowManager/components/Window';
import DefaultWindow from '../features/windowManager/components/DefaultWindow';
import { RootState } from '../store';

const MainView: React.FC = () => {
  const dispatch = useDispatch();
  const windows = useSelector((state: RootState) => selectWindows(state));

  useEffect(() => {
    dispatch(createWindow({ windowComponent: DefaultWindow }));
  }, [dispatch]);

  const handleCreateWindow = () => {
    dispatch(createWindow({ windowComponent: DefaultWindow }));
  };

  return (
    <div className="relative size-full overflow-hidden">
      <button onClick={handleCreateWindow}>Open Window</button>
      {Object.entries(windows).map(([id, window]) => (
        <Window key={id} id={id} />
      ))}
    </div>
  );
};

export default MainView;
