import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TracksProvider } from './contexts/TracksContext'
import { WalletProvider } from './contexts/WalletContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WalletProvider>
      <TracksProvider>
        <App />
      </TracksProvider>
    </WalletProvider>
  </StrictMode>,
)
