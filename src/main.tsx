import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import HomePage from './pages/Home/Home.page.tsx'
import LoginPage from './pages/Login/Login.page.tsx'
import RegisterPage from './pages/Register/Register.page.tsx'
import LeaderboardsPage from './pages/Leaderboards/Leaderboards.page.tsx'
import ProtectedRoute from './components/Widgets/ProtectedRoute.tsx'
import { Header } from './components/Header/Header.tsx'
import { AuthProvider } from './hooks/useAuth/useAuth.tsx'
import {
  createTheme,
  CssBaseline,
  GlobalStyles,
  ThemeProvider,
} from '@mui/material'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const routerBasename = ((): string => {
  const base = import.meta.env.BASE_URL ?? '/'
  if (base === '/' || base === '') {
    return '/'
  }

  if (base === '.' || base === './') {
    try {
      const pathname = new URL(document.baseURI).pathname || '/'
      if (pathname === '/' || pathname === '') {
        return '/'
      }

      return pathname.replace(/\/$/, '')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return '/'
    }
  }

  return base.replace(/\/$/, '')
})()

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#020617',
    },
  },
})

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
})

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
              <Header />
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/leaderboards" element={<LeaderboardsPage />} />
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
