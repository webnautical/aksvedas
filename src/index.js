import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import { ContextProvider } from './context/ContextProvider';
import { FrontContextProvider } from './context/FrontContextProvider';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <BrowserRouter>
      <ContextProvider>
        <FrontContextProvider>
          <App />
        </FrontContextProvider>
      </ContextProvider>
    </BrowserRouter>
  </>
);

