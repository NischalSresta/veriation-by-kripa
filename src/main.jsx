import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/geist';
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import { BagProvider } from './context/BagContext';
import App from './App';
import './styles.css';
import './premium.css';
import './components/WorkHero.css';
import './components/AtelierMotion.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <BagProvider>
        <App />
      </BagProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
