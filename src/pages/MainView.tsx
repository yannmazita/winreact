import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createWindow, selectWindows } from '../features/windowManager/store/windowsSlice';
import { createDualPaneWindow } from '../features/windowManager/utils/createDualPaneWindow';
import WindowContainer from '../features/windowManager/components/WindowContainer';
import { WindowDualPaneContent } from '@/features/windowManager/types/windowInterfaces';

const MainView: React.FC = () => {
  const dispatch = useDispatch();
  const windows = useSelector(selectWindows);

  const dualPaneContents: WindowDualPaneContent[] = [
    { label: 'Pane 1', componentType: 'defaultDualPane' },
    { label: 'Pane 2', componentType: 'default' },
  ];

  const handleCreateRegularWindow = () => {
    dispatch(createWindow({ windowComponentType: 'default' }));
  };
  const handleCreateDualPaneWindow = () => {
    createDualPaneWindow(dispatch, 'defaultDualPane', dualPaneContents);
  };

  return (
    <>
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
      <div className="relative size-full overflow-hidden">
        <div id="window-container" className="relative size-full overflow-hidden">
          {Object.entries(windows).map(([id, window]) => (
            <WindowContainer key={id} id={id} />
          ))}
        </div>
      </div>
    </>
  );
};

export default MainView;
