// src/features/windowManager/hooks/useResizable.ts

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectWindow, updateWindow } from '../store/windowsSlice';
import { RootState } from '@/store';

export function useResizable(id: string) {
    const dispatch = useDispatch();
    const window = useSelector((state: RootState) => selectWindow(state, id));

    const adjustSize = useCallback((dx: number, dy: number, expandRight: boolean, expandDown: boolean) => {
        if (!window) return;

        const parent = document.getElementById('window-container');
        if (!parent) return;

        const parentRect = parent.getBoundingClientRect();

        let newWidth = window.width + (expandRight ? dx : -dx);
        let newHeight = window.height + (expandDown ? dy : -dy);
        let newX = window.xPos;
        let newY = window.yPos;

        if (!expandRight) {
            newX = Math.max(0, Math.min(window.xPos + dx, window.xPos + window.width - window.minimumWidth));
        }

        if (!expandDown) {
            newY = Math.max(0, Math.min(window.yPos + dy, window.yPos + window.height - window.minimumHeight));
            newHeight = window.yPos - newY + window.height;
            if (newY + newHeight > parentRect.bottom) {
                newHeight = parentRect.bottom - newY;
            }
        }

        if (newX + newWidth > parentRect.width) {
            newWidth = parentRect.width - newX;
        }
        if (newY + newHeight > parentRect.height) {
            newHeight = parentRect.height - newY;
        }

        newWidth = Math.min(Math.max(newWidth, window.minimumWidth), window.maximumWidth);
        newHeight = Math.min(Math.max(newHeight, window.minimumHeight), window.maximumHeight);

        dispatch(updateWindow({
            id,
            updates: {
                xPos: newX,
                yPos: newY,
                width: newWidth,
                height: newHeight
            }
        }));
    }, [dispatch, id, window]);

    const handleResize = useCallback((event: MouseEvent) => {
        if (!window?.resizing) return;

        const dx = event.clientX - window.lastMouseX;
        const dy = event.clientY - window.lastMouseY;

        switch (window.resizeDirection) {
            case 'se':
                adjustSize(dx, dy, true, true);
                break;
            case 'sw':
                adjustSize(dx, dy, false, true);
                break;
            case 'nw':
                adjustSize(dx, dy, false, false);
                break;
            case 'ne':
                adjustSize(dx, dy, true, false);
                break;
            case 'north':
                adjustSize(0, dy, false, false);
                break;
            case 'south':
                adjustSize(0, dy, false, true);
                break;
            case 'east':
                adjustSize(dx, 0, true, true);
                break;
            case 'west':
                adjustSize(dx, 0, false, false);
                break;
        }

        dispatch(updateWindow({
            id,
            updates: { lastMouseX: event.clientX, lastMouseY: event.clientY }
        }));
    }, [adjustSize, dispatch, id, window]);

    const toggleResize = useCallback((direction: string, event: React.MouseEvent<HTMLElement>) => {
        dispatch(updateWindow({
            id,
            updates: {
                resizing: true,
                resizeDirection: direction,
                lastMouseX: event.clientX,
                lastMouseY: event.clientY
            }
        }));

        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize, { once: true });
    }, [dispatch, handleResize, id]);

    const stopResize = useCallback(() => {
        dispatch(updateWindow({
            id,
            updates: { resizing: false, resizeDirection: '' }
        }));
        document.removeEventListener('mousemove', handleResize);
    }, [dispatch, handleResize, id]);

    return {
        toggleResize,
    };
}
