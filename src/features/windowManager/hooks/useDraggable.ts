// src/features/windowManager/hooks/useDraggable.ts

import { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectWindow, updateWindow } from '../store/windowsSlice';
import { RootState } from '@/store';

export function useDraggable(id: string) {
  const dispatch = useDispatch();
  const window = useSelector((state: RootState) => selectWindow(state, id));
  const rootElement = useRef<HTMLDivElement | null>(null);
  const [heightOffset, setHeightOffset] = useState(0);
  const initialMousePosition = useRef({ x: 0, y: 0 });
  const initialWindowPosition = useRef({ x: 0, y: 0 });

  const handleDrag = useCallback((event: MouseEvent) => {
    if (!rootElement.current || !window) return;
    if (window.isMaximized || window.isMinimized) return;

    const parent = rootElement.current.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const dx = event.clientX - initialMousePosition.current.x;
    const dy = event.clientY - initialMousePosition.current.y;

    let newXPos = initialWindowPosition.current.x + dx;
    let newYPos = initialWindowPosition.current.y + dy;

    newXPos = Math.max(0, Math.min(newXPos, parentRect.width - window.width));
    newYPos = Math.max(0, Math.min(newYPos, parentRect.height - window.height - heightOffset));

    dispatch(updateWindow({
      id,
      updates: {
        xPos: newXPos,
        yPos: newYPos,
        lastMouseX: event.clientX,
        lastMouseY: event.clientY
      }
    }));
  }, [dispatch, id, window, heightOffset]);

  const stopDrag = useCallback((event: MouseEvent) => {
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);

    dispatch(updateWindow({
      id,
      updates: {
        lastMouseX: event.clientX,
        lastMouseY: event.clientY
      }
    }));
  }, [dispatch, handleDrag, id]);

  const startDrag = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (window?.isMaximized) return;

    if (rootElement.current) {
      setHeightOffset(rootElement.current.parentElement?.offsetTop ?? 0);
    }

    initialMousePosition.current = { x: event.clientX, y: event.clientY };
    initialWindowPosition.current = { x: window?.xPos ?? 0, y: window?.yPos ?? 0 };

    dispatch(updateWindow({
      id,
      updates: {
        lastMouseX: event.clientX,
        lastMouseY: event.clientY
      }
    }));

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
  }, [dispatch, handleDrag, stopDrag, window]);

  const updateRootElement = useCallback((element: HTMLDivElement | null) => {
    rootElement.current = element;
    if (element) {
      setHeightOffset(element.parentElement?.offsetTop ?? 0);
    }
  }, []);

  return {
    startDrag,
    updateRootElement,
  };
}
