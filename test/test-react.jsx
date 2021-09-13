/*! Agile Pixel https://agilepixel.io - 2021*/
import React, { useState } from 'react';
import { render } from 'react-dom';

const App = function () {
  const [state, setState] = useState('CLICK ME');

  return <button onClick={() => setState('CLICKED')}>{state}</button>;
};

render(<App />, document.querySelector('#root'));
