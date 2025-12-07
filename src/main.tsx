import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import HomePage from './pages/Home.page.tsx'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import './index.css'

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#020617',
    },
  },
})

// Normalize Vite's BASE_URL so it works as a react-router basename.
// Vite sets import.meta.env.BASE_URL from vite.config.ts `base` (e.g. '/clicker-game-ui/').
// - If BASE_URL is '/', keep it as '/' (root)
// - Otherwise strip the trailing slash so basename doesn't end up with a trailing '/'
const routerBasename = import.meta.env.BASE_URL === '/' ? '/' : import.meta.env.BASE_URL.replace(/\/$/, '')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Use normalized Vite BASE_URL as the router basename so routes work when deployed to a subpath */}
      <BrowserRouter basename={routerBasename}>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
