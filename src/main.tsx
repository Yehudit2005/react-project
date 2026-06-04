import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App';
import { BrowserRouter } from 'react-router';


createRoot(document.getElementById('root')!).render(
  <React.Fragment>
    <BrowserRouter>
    <App></App>
    </BrowserRouter>
    
  </React.Fragment>
)
