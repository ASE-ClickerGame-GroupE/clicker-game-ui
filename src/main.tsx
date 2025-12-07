import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import HomePage from './pages/Home.page.tsx'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import './index.css'

// Add a normalized router basename using Vite's build-time BASE_URL
const routerBasename = ((): string => {
  // import.meta.env.BASE_URL is replaced at build time by Vite
  // It usually is "/" for root or "/repo-name/" when `base` is set in vite.config
  // When building with relative assets (base = './' or '.'), we should derive
  // the actual deploy path from the runtime URL so React Router gets a useful basename.
  const base = import.meta.env.BASE_URL ?? '/'

  // Simple log of raw values for debugging
  try {
    // document may be undefined in some SSR/test environments
    console.log('BASE_URL (raw):', base, 'document.baseURI:', typeof document !== 'undefined' ? document.baseURI : 'undefined')
  } catch {
    // ignore
  }

  // Keep root as '/', otherwise remove trailing slash for Router compatibility
  if (base === '/' || base === '') {
    console.log('resolved routerBasename -> / (root)')
    return '/'
  }

  // If Vite produced a relative base like './' or '.', derive the base from the current page URL.
  if (base === '.' || base === './') {
    try {
      // document.baseURI usually contains the page location; URL.pathname gives the path on the server
      const pathname = new URL(document.baseURI).pathname || '/'
      // If the app is served at the root, just return '/'
      if (pathname === '/' || pathname === '') {
        console.log('relative BASE_URL detected; resolved routerBasename -> / (root)')
        return '/'
      }
      const resolved = pathname.replace(/\/$/, '')
      console.log('relative BASE_URL detected; resolved routerBasename ->', resolved)
      // Remove trailing slash for Router compatibility
      return resolved
    } catch (e) {
      console.error('error deriving basename from document.baseURI, falling back to /', e)
      // Fallback to root if anything goes wrong
      return '/'
    }
  }

  const normalized = base.replace(/\/$/, '')
  console.log('normalized BASE_URL ->', normalized)
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

// Mount with simple logs so we can see failures
try {
  console.log('mounting app with basename=', routerBasename)
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
  console.log('app mounted successfully')
} catch (err) {
  console.error('render failed', err)
}
