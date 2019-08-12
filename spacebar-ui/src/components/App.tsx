import React from 'react';
import { Classes } from '@blueprintjs/core';

import '@blueprintjs/core/lib/css/blueprint.css';

import SpacebarMainPage from 'components/SpacebarMainPage';

import 'styles/App.css';


const App = () => (
  <div
    className={`App ${Classes.DARK}`}
    style={{ width: '100%', height: '100%' }}
  >
    <SpacebarMainPage />
  </div>
);

export default App;
