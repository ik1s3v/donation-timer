import { CssBaseline } from '@mui/material';
import { BridgeContext } from '@widy/react';
import { WidgetOutboundBridge } from '@widy/sdk';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../i18n/i18n';
import { Provider } from 'react-redux';
import { store } from '../store';
import './index.css';

const bridge = new WidgetOutboundBridge();

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <BridgeContext.Provider value={bridge}>
        <Provider store={store}>
          <CssBaseline />
          <App />
        </Provider>
      </BridgeContext.Provider>
    </React.StrictMode>,
  );
}
