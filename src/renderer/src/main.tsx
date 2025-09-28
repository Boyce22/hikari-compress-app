

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HikariCompressApp } from './App'
import './globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HikariCompressApp />
  </StrictMode>
)
