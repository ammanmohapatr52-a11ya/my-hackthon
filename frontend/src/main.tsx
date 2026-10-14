import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import { initOfflineSyncListeners } from './services/offlineSyncService'

// Initialize offline sync listeners for reconnect synchronization
initOfflineSyncListeners()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

