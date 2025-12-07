import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router'
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

// eslint-disable-next-line react-refresh/only-export-components
const RoutesWrapper = () => {
  const location = useLocation()
  console.log(location, 'location')
  return (
    <Routes location={location}>
      <Route path="/" element={<HomePage />} />
    </Routes>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <RoutesWrapper />
        </BrowserRouter>
      </ThemeProvider>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
