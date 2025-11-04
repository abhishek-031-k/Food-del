import reactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import React from 'react'
import StoreContextProvider from './context/StoreContext.jsx'


reactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StoreContextProvider>
      <App/>
 </StoreContextProvider>
  </BrowserRouter>
)