import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AppProvider } from './context/AppContext';
import { CallProvider } from './context/CallContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <CallProvider>
        <App />
      </CallProvider>
    </AppProvider>
  </React.StrictMode>
);
