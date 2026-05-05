import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppDetails from './pages/AppDetails'
import Login from './pages/Login'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import RequireAuth from './components/RequireAuth'

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/', element: <RequireAuth><App /></RequireAuth> },
  { path: '/apps/:id', element: <RequireAuth><AppDetails /></RequireAuth> },
])

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1f6f8b' },
    secondary: { main: '#f4a259' },
    background: { default: '#f4f1ea', paper: '#ffffff' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Space Grotesk", system-ui, sans-serif',
    h1: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h2: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h3: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          borderColor: 'rgba(31, 111, 139, 0.12)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
