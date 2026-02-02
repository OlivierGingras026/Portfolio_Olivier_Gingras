import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './i18n/config.ts'

const container = document.getElementById('root')!
createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
