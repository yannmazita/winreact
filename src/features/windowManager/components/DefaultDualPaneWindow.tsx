// src/features/windowManager/components/DefaultDualPaneWindow.tsx

import React from 'react';
import '../styles/style.css';

interface DefaultDualPaneWindowProps {
  id: string;
}

const DefaultDualPaneWindow: React.FC<DefaultDualPaneWindowProps> = ({ id }) => {
  return (
    <div>
      Welcome Pane <br />
      {id}
    </div>
  );
};

export default DefaultDualPaneWindow;
