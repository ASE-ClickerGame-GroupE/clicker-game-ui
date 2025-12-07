import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import HomePage from './pages/Home.page.tsx'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import './index.css'

const routerBasename = ((): string => {
  const base = import.meta.env.BASE_URL ?? '/'
  try {
    console.log('BASE_URL (raw):', base, 'document.baseURI:', typeof document !== 'undefined' ? document.baseURI : 'undefined')
  } catch {
    // ignore
  }

  if (base === '/' || base === '') {
    console.log('resolved routerBasename -> / (root)')
    return '/'
  }

  if (base === '.' || base === './') {
    try {
      const pathname = new URL(document.baseURI).pathname || '/'
      if (pathname === '/' || pathname === '') {
        console.log('relative BASE_URL detected; resolved routerBasename -> / (root)')
        return '/'
      }
      const resolved = pathname.replace(/\/$/, '')
      console.log('relative BASE_URL detected; resolved routerBasename ->', resolved)
      return resolved
    } catch (e) {
      console.error('error deriving basename from document.baseURI, falling back to /', e)
      return '/'
    }
  }

  const normalized = base.replace(/\/$/, '')
  return normalized
})()

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#020617',
    },
  },
})

try {
  console.log('mounting app with basename=', routerBasename)
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter basename={routerBasename}>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </StrictMode>
  )
  console.log('app mounted successfully')
} catch (err) {
  console.error('render failed', err)
}
