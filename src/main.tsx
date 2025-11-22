import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Route, Routes } from 'react-router'
import { HomePage } from './pages/Home.page.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  </StrictMode>
)
