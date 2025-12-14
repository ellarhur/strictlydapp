import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TracksProvider } from './contexts/TracksContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TracksProvider>
      <App />
    </TracksProvider>
  </StrictMode>,
)
