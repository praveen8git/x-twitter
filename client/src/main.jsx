import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import IsAuthenticatedContextProvider from "./contexts/IsAuthenticatedContextProvider";
import App from './App.jsx'
import 'react-responsive-modal/styles.css';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <IsAuthenticatedContextProvider>
        <App />
      </IsAuthenticatedContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
