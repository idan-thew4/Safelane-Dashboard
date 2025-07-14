import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { Store } from './Context/Store'
import './styles/style.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Store>
      <App />
    </Store>
  </BrowserRouter>

)
