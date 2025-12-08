import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import HomePage from './pages/Home.page.tsx'
import LoginPage from './pages/Login.page'
import RegisterPage from './pages/Register.page'
import { AuthProvider } from './hooks/useAuth'
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  GlobalStyles,
} from '@mui/material'
import './index.css'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const routerBasename = ((): string => {
  const base = import.meta.env.BASE_URL ?? '/'
  try {
    console.log(
      'BASE_URL (raw):',
      base,
      'document.baseURI:',
      typeof document !== 'undefined' ? document.baseURI : 'undefined'
    )
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
        console.log(
          'relative BASE_URL detected; resolved routerBasename -> / (root)'
        )
        return '/'
      }
      const resolved = pathname.replace(/\/$/, '')
      console.log(
        'relative BASE_URL detected; resolved routerBasename ->',
        resolved
      )
      return resolved
    } catch (e) {
      console.error(
        'error deriving basename from document.baseURI, falling back to /',
        e
      )
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

const queryClient = new QueryClient()

try {
  console.log('mounting app with basename=', routerBasename)
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            'html, body, #root': {
              height: '100%',
              margin: 0,
              padding: 0,
              backgroundColor: '#020617',
            },
          }}
        />
        <QueryClientProvider client={queryClient}>
          <BrowserRouter basename={routerBasename}>
            <AuthProvider>
              <Routes>
                <Route
                  path="/"
                  element={
                    <HomePage />
                    // <ProtectedRoute>
                    //   <HomePage />
                    // </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  )
  console.log('app mounted successfully')
} catch (err) {
  console.error('render failed', err)
}
