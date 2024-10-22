// src/features/windowManager/components/AppDefaultWindow.tsx

import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectWindow } from '../store/windowsSlice';
import { RootState } from '../../../store';
import { Window } from '../types/windowInterfaces';

interface AppDefaultWindowProps {
  id: string;
}

const AppDefaultWindow: React.FC<AppDefaultWindowProps> = ({ id }) => {
  const window = useSelector((state: RootState) => selectWindow(state, id));
  const [changedProperties, setChangedProperties] = useState<Set<string>>(new Set());
  const prevWindowRef = useRef<Window | null>(null);

  useEffect(() => {
    if (window) {
      const newChangedProperties = new Set<string>();
      Object.keys(window).forEach(key => {
        if (prevWindowRef.current && window[key as keyof Window] !== prevWindowRef.current[key as keyof Window]) {
          newChangedProperties.add(key);
        }
      });
      setChangedProperties(newChangedProperties);

      const timer = setTimeout(() => {
        setChangedProperties(new Set());
      }, 500);

      prevWindowRef.current = { ...window };

      return () => clearTimeout(timer);
    }
  }, [window]);

  if (!window) return null;

  const excludeProperties = ['windowComponent', 'windowComponentKey'];

  return (
    <div className="flex flex-col">
      {Object.entries(window)
        .filter(([key]) => !excludeProperties.includes(key))
        .map(([key, value]) => (
          <span
            key={key}
            className={changedProperties.has(key) ? 'text-red-500' : 'text-black'}
          >
            {key}: {JSON.stringify(value)}
          </span>
        ))
      }
    </div>
  );
};

export default AppDefaultWindow;
