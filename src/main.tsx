import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.tsx';
import {Helmet, HelmetProvider} from 'react-helmet-async';
import {BrowserRouter} from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <Helmet
        defaultTitle="Spotify Clone"
        titleTemplate="%s | Spotify Clone"
      ></Helmet>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
