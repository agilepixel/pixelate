/*! Agile Pixel https://agilepixel.io - 2021*/
import React, { useState } from 'react';
import { render } from 'react-dom';

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

render(<App />, document.querySelector('#root'));
