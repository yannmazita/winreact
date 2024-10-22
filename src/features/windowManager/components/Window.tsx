// src/features/windowManager/components/AppWindow.tsx

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectWindow, updateWindow, closeWindow, maximizeWindow, minimizeWindow, focusWindow } from '../store/windowsSlice';
import { useDraggable } from '../hooks/useDraggable';
import { useResizable } from '../hooks/useResizable';
import { RootState } from '../../../store';
import '../styles/style.css'
import { Window } from '../types/windowInterfaces';

interface AppWindowProps {
  id: string;
}

const AppWindow: React.FC<AppWindowProps> = ({ id }) => {
  const dispatch = useDispatch();
  const window = useSelector((state: RootState) => selectWindow(state, id));
  const { toggleDrag, updateRootElement } = useDraggable(id);
  const { toggleResize } = useResizable(id);
  const componentRef = useRef<HTMLDivElement>(null);
  const [dynamicClasses, setDynamicClasses] = useState<Record<string, boolean>>({});

  const dualPaneContents = useSelector((state: RootState) =>
    state.windows.windows[id]?.windowProps?.dualPaneContents
  );

  React.useEffect(() => {
    updateRootElement(componentRef.current);
  }, [updateRootElement]);

  const styleObject = useMemo(() => ({
    top: window?.isMaximized ? '0' : `${window?.yPos}px`,
    left: window?.isMaximized ? '0' : `${window?.xPos}px`,
    width: window?.isMaximized ? '100%' : `${window?.width}px`,
    height: window?.isMaximized ? '100%' : `${window?.height}px`,
    zIndex: window?.zIndex,
  }), [window]);

  const closeComponent = useCallback(() => {
    if (window) dispatch(closeWindow(window.id));
  }, [dispatch, window]);

  const maximizeComponent = useCallback(() => {
    if (window) dispatch(maximizeWindow(window.id));
  }, [dispatch, window]);

  const minimizeComponent = useCallback(() => {
    if (window) dispatch(minimizeWindow(window.id));
  }, [dispatch, window]);

  const focusWindowHandler = useCallback(() => {
    if (window) dispatch(focusWindow(window.id));
  }, [dispatch, window]);

  const updateDynamicClasses = useCallback((classes: Record<string, boolean>) => {
    setDynamicClasses(prevClasses => ({ ...prevClasses, ...classes }));
  }, []);

  if (!window) return null;

  return (
    <div
      ref={componentRef}
      className={`draggable-resizable bg-gray-600 ${Object.entries(dynamicClasses)
        .filter(([, value]) => value)
        .map(([key]) => key)
        .join(' ')}`}
      style={styleObject}
      onMouseDown={focusWindowHandler}
    >
      <div
        className="flex justify-between bg-[#f0f0f0] p-1.5 cursor-move"
        onMouseDown={(e) => toggleDrag(e)}
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
      {dualPaneContents ? (
        <div className="p-2 h-full w-full grid grid-cols-3">
          <div className="col-span-1 border border-ts-blue mr-1">
            <ul>
              {dualPaneContents.map((item, index) => (
                <li
                  key={index}
                  onClick={() => dispatch(updateWindow({
                    id: window.id,
                    updates: { windowComponent: item.component }
                  }))}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
          <div className={`content-container col-span-2 ${Object.keys(dynamicClasses).join(' ')}`}>
            <window.windowComponent
              key={window.windowComponentKey}
              {...window.windowProps}
              onAddClasses={updateDynamicClasses}
            />
          </div>
        </div>
      ) : (
        <div className={`content-container ${Object.keys(dynamicClasses).join(' ')}`}>
          <window.windowComponent
            key={window.windowComponentKey}
            {...window.windowProps}
            onAddClasses={updateDynamicClasses}
          />
        </div>
      )}
      <div className="resizer se" onMouseDown={(e) => toggleResize('se', e)}></div>
      <div className="resizer sw" onMouseDown={(e) => toggleResize('sw', e)}></div>
      <div className="resizer nw" onMouseDown={(e) => toggleResize('nw', e)}></div>
      <div className="resizer ne" onMouseDown={(e) => toggleResize('ne', e)}></div>
      <div className="resizer north" onMouseDown={(e) => toggleResize('north', e)}></div>
      <div className="resizer south" onMouseDown={(e) => toggleResize('south', e)}></div>
      <div className="resizer east" onMouseDown={(e) => toggleResize('east', e)}></div>
      <div className="resizer west" onMouseDown={(e) => toggleResize('west', e)}></div>
    </div>
  );
};

export default AppWindow;
