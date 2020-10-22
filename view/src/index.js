import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { StylesProvider } from '@material-ui/core/styles';

import App from './components/app/App';
import Firebase, { FirebaseContext } from './components/firebase';
import * as serviceWorker from './serviceWorker';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <StylesProvider injectFirst>
      <BrowserRouter>
        <FirebaseContext.Provider value={new Firebase()}>
          <App />
        </FirebaseContext.Provider>
      </BrowserRouter>
    </StylesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
