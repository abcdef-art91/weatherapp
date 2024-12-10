import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "primereact/resources/themes/lara-light-cyan/theme.css"
import 'primeicons/primeicons.css'
import App from './App.jsx'
import { PrimeReactProvider } from 'primereact/api'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </StrictMode>,
)
