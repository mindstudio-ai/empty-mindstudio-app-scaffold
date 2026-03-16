import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import BrowserStyleReset from './style/BrowserStyleReset.tsx';
import { StyleSheetManager } from 'styled-components';

createRoot(document.getElementById('root')!).render(
  <StyleSheetManager>
    <BrowserStyleReset />
    <App />
  </StyleSheetManager>,
);
