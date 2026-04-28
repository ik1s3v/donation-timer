import { CssBaseline, createTheme, ThemeProvider } from '@mui/material';
import { BridgeContext } from '@widy/react';
import { WidgetOutboundBridge } from '@widy/sdk';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../i18n/i18n';
import { Provider } from 'react-redux';
import { store } from '../store';
import { dark } from '../theme/default';

const bridge = new WidgetOutboundBridge();

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <BridgeContext.Provider value={bridge}>
        <Provider store={store}>
          <ThemeProvider theme={createTheme(dark)}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </Provider>
      </BridgeContext.Provider>
    </React.StrictMode>,
  );
}
