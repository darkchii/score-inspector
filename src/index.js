import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import "@fontsource/comfortaa";
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import 'react-virtualized/styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //use basename /score-inspector/ only when not using gh-pages
  //otherwise use basename '/'
  <BrowserRouter basename='/'>
    <App />
  </BrowserRouter>
);
