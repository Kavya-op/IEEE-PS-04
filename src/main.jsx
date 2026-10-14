import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MotionProvider } from './context/MotionContext'
import { OSINTProvider } from './context/OSINTContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionProvider>
      <OSINTProvider>
        <App />
      </OSINTProvider>
    </MotionProvider>
  </StrictMode>,
)
