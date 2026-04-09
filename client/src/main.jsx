import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CurrencyProvider } from './CurrencyContext'
import { AuthProvider } from './AuthContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CurrencyProvider>
          <App />
        </CurrencyProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
