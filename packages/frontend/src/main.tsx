import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import App from './app/App';
import { store } from './app/store';
import { GlobalStyle } from './styles/GlobalStyle';
import { theme } from './styles/theme';
import './index.css';

// WHY: StrictMode helps identify potential problems in development
// It double-invokes functions to detect side effects
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* WHY: ThemeProvider makes theme available to all styled-components */}
    <ThemeProvider theme={theme}>
      {/* WHY: GlobalStyle applies global CSS and CSS variables */}
      <GlobalStyle />
      {/* WHY: Redux Provider makes store available to all components */}
      <Provider store={store}>
        {/* WHY: BrowserRouter enables client-side routing */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);

