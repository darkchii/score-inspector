import ReactDOM from 'react-dom/client';
// import App from './App';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import "@fontsource/comfortaa";
import "@fontsource/ubuntu/300.css";
import "@fontsource/ubuntu/400.css";
import "@fontsource/ubuntu/500.css";
import "@fontsource/ubuntu/700.css";
import App from './App';
import { BrowserRouter } from 'react-router';
import 'react-virtualized/styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //use basename /score-inspector/ only when not using gh-pages
  //otherwise use basename '/'
  <BrowserRouter basename='/'>
    <App />
  </BrowserRouter>
);
