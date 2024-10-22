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

    const updateRootElement = useCallback((element: HTMLDivElement | null) => {
        rootElement.current = element;
        if (element) {
            setHeightOffset(element.parentElement?.offsetTop ?? 0);
        }
    }, []);

    const handleDrag = useCallback((event: MouseEvent) => {
        if (!rootElement.current || !window?.dragging) return;
        if (window.isMaximized || window.isMinimized) return;

        const parent = rootElement.current.parentElement;
        if (!parent) return;

        const parentRect = parent.getBoundingClientRect();
        const dx = event.clientX - window.lastMouseX;
        const dy = event.clientY - window.lastMouseY;

        let newXPos = window.xPos + dx;
        let newYPos = window.yPos + dy;

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
        dispatch(updateWindow({
            id,
            updates: {
                dragging: false,
                lastMouseX: event.clientX,
                lastMouseY: event.clientY
            }
        }));
        document.removeEventListener('mousemove', handleDrag);
    }, [dispatch, handleDrag, id]);

    const toggleDrag = useCallback((event: React.MouseEvent<HTMLElement>) => {
        if (rootElement.current) {
            setHeightOffset(rootElement.current.parentElement?.offsetTop ?? 0);
        }

        dispatch(updateWindow({
            id,
            updates: {
                dragging: true,
                lastMouseX: event.clientX,
                lastMouseY: event.clientY
            }
        }));
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', stopDrag, { once: true });
    }, [dispatch, handleDrag, id, stopDrag]);

    return {
        toggleDrag,
        updateRootElement,
    };
}
