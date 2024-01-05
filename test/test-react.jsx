/*! Agile Pixel https://agilepixel.io - 2024*/
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import Test from './TestComponent';

const App = function () {
  const [state, setState] = useState('CLICK ME');

  return (
    <button onClick={() => setState('CLICKED')}>
      {state}
      <Test />
    </button>
  );
};

const container = document.querySelector('#root');
const root = createRoot(container);
root.render(<App />);
