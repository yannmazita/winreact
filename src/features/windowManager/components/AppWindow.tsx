// src/features/windowManager/components/AppWindow.tsx

import React, { useCallback, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectWindow, updateWindow, closeWindow, maximizeWindow, minimizeWindow, focusWindow } from '../store/windowsSlice';
import { useDraggable } from '../hooks/useDraggable';
import { useResizable } from '../hooks/useResizable';
import { RootState } from '@/store';
import '../styles/style.css';

interface AppWindowProps {
  id: string;
  children: React.ReactNode;
}

const AppWindow: React.FC<AppWindowProps> = ({ id, children }) => {
  const dispatch = useDispatch();
  const window = useSelector((state: RootState) => selectWindow(state, id));
  const { toggleDrag, updateRootElement } = useDraggable(id);
  const { toggleResize } = useResizable(id);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updateRootElement(componentRef.current);
  }, [updateRootElement]);

  const closeComponent = useCallback(() => {
    dispatch(closeWindow(id));
  }, [dispatch, id]);

  const maximizeComponent = useCallback(() => {
    dispatch(maximizeWindow(id));
  }, [dispatch, id]);

  const minimizeComponent = useCallback(() => {
    dispatch(minimizeWindow(id));
  }, [dispatch, id]);

  const focusWindowHandler = useCallback(() => {
    dispatch(focusWindow(id));
  }, [dispatch, id]);

  if (!window) return null;

  const styleObject = {
    top: window.isMaximized ? '0' : `${window.yPos}px`,
    left: window.isMaximized ? '0' : `${window.xPos}px`,
    width: window.isMaximized ? '100%' : `${window.width}px`,
    height: window.isMaximized ? '100%' : `${window.height}px`,
    zIndex: window.zIndex,
  };

  return (
    <div
      ref={componentRef}
      className="draggable-resizable bg-gray-600"
      style={styleObject}
      onMouseDown={focusWindowHandler}
    >
      <div
        className="flex justify-between bg-[#f0f0f0] p-1.5 cursor-move"
        onMouseDown={toggleDrag}
      >
        <div className="w-fit">Drag Me Up!</div>
        <div className="w-fit">
          <button className="mx-2" onClick={minimizeComponent}>Minimize</button>
          <button className="mx-2" onClick={maximizeComponent}>
            {window.isMaximized ? 'Restore' : 'Maximize'}
          </button>
          <button className="mx-2" onClick={closeComponent}>Close</button>
        </div>
      </div>
      <div className="content-container">
        {children}
      </div>
      {!window.isMaximized && (
        <>
          <div className="resizer se" onMouseDown={(e) => toggleResize('se', e)}></div>
          <div className="resizer sw" onMouseDown={(e) => toggleResize('sw', e)}></div>
          <div className="resizer nw" onMouseDown={(e) => toggleResize('nw', e)}></div>
          <div className="resizer ne" onMouseDown={(e) => toggleResize('ne', e)}></div>
          <div className="resizer north" onMouseDown={(e) => toggleResize('north', e)}></div>
          <div className="resizer south" onMouseDown={(e) => toggleResize('south', e)}></div>
          <div className="resizer east" onMouseDown={(e) => toggleResize('east', e)}></div>
          <div className="resizer west" onMouseDown={(e) => toggleResize('west', e)}></div>
        </>
      )}
    </div>
  );
};

export default AppWindow;
