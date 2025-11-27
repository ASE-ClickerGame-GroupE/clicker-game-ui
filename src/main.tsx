import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import HomePage from './pages/Home.page.tsx';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import './index.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#020617',
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
