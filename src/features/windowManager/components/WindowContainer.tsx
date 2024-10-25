// src/features/windowManager/components/WindowContainer.tsx

import React, { useCallback, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectWindow, closeWindow, maximizeWindow, minimizeWindow, focusWindow, setActivePane } from '../store/windowsSlice';
import { useDraggable } from '../hooks/useDraggable';
import { useResizable } from '../hooks/useResizable';
import { RootState } from '@/store';
import { componentMap } from '../utils/componentMap';
import '../styles/style.css';

interface WindowContainerProps {
  id: string;
}

const WindowContainer: React.FC<WindowContainerProps> = ({ id }) => {
  const dispatch = useDispatch();
  const currentWindow = useSelector((state: RootState) => selectWindow(state, id));
  const { startDrag, updateRootElement: updateDraggableElement } = useDraggable(id);
  const { toggleResize, updateRootElement: updateResizableElement } = useResizable(id);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updateDraggableElement(componentRef.current);
    updateResizableElement(componentRef.current);
  }, [updateDraggableElement, updateResizableElement]);

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

  const handlePaneChange = (paneIndex: number) => {
    dispatch(setActivePane({ id, paneIndex }));
  };

  if (!currentWindow) return null;

  const styleObject = {
    position: 'absolute' as const,
    top: currentWindow.isMaximized ? '0' : `${currentWindow.yPos}px`,
    left: currentWindow.isMaximized ? '0' : `${currentWindow.xPos}px`,
    width: currentWindow.isMaximized ? '100%' : `${currentWindow.width}px`,
    height: currentWindow.isMaximized ? '100%' : `${currentWindow.height}px`,
    zIndex: currentWindow.zIndex,
  };

  let WindowComponent;
  if (currentWindow.windowProps.dualPaneContents) {
    const activePane = currentWindow.windowProps.activePane || 0;
    const activeComponentType = currentWindow.windowProps.dualPaneContents[activePane].componentType;
    WindowComponent = componentMap[activeComponentType];
  } else {
    WindowComponent = componentMap[currentWindow.windowComponentType];
  }

  return (
    <div
      ref={componentRef}
      className="draggable-resizable bg-gray-600"
      style={styleObject}
      onMouseDown={focusWindowHandler}
    >
      <div
        className="flex justify-between bg-[#f0f0f0] p-1.5 cursor-move"
        onMouseDown={startDrag}
      >
        <div className="w-fit">Drag Me Up!</div>
        <div className="w-fit">
          <button className="mx-2" onClick={minimizeComponent}>Minimize</button>
          <button className="mx-2" onClick={maximizeComponent}>
            {currentWindow.isMaximized ? 'Restore' : 'Maximize'}
          </button>
          <button className="mx-2" onClick={closeComponent}>Close</button>
        </div>
      </div>
      {currentWindow.windowProps.dualPaneContents ? (
        <div className="p-2 h-full w-full grid grid-cols-3">
          <div className="col-span-1 border border-ts-blue mr-1">
            <ul>
              {currentWindow.windowProps.dualPaneContents.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handlePaneChange(index)}
                  className={`cursor-pointer hover:bg-gray-100 ${index === currentWindow.windowProps.activePane ? 'bg-blue-200' : ''}`}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="content-container col-span-2">
            <WindowComponent id={id} {...currentWindow.windowProps} />
          </div>
        </div>
      ) : (
        <div className="content-container">
          <WindowComponent id={id} {...currentWindow.windowProps} />
        </div>
      )}
      {!currentWindow.isMaximized && (
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

export default WindowContainer;
