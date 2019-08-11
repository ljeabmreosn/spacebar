import React from 'react';
import ReactDOM from 'react-dom';

import 'ag-grid-community/dist/styles/ag-grid.css';

import App from 'components/App';
import * as serviceWorker from 'scripts/serviceWorker';

import 'styles/index.css';


ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();