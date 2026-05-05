import { useState } from 'react'
import { Box, Button, Container, Paper, TextField, Typography, Stack } from '@mui/material'
import { useNavigate, Navigate } from 'react-router-dom'
import { apiFetch, setToken } from '../lib/api'

export default function Login() {
  const [email, setEmail] = useState('demo@local.test')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  if (token) return <Navigate to="/" replace />

  const login = async () => {
    try {
      setError(null)
      const data = await apiFetch<{ accessToken: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }, { withAuth: false })
      setToken(data.accessToken)
      navigate('/', { replace: true })
    } catch {
      setError('Login failed')
    }
  }

  return (
    <Container sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, width: 380, borderRadius: 3 }} elevation={4}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Welcome back</Typography>
            <Typography color="text.secondary">Use the demo account to explore the store.</Typography>
          </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') login() }} />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') login() }} />
          {error && <Typography color="error">{error}</Typography>}
          <Button variant="contained" onClick={login}>Login</Button>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Demo credentials</Typography>
          <Typography variant="body2">demo@local.test / password</Typography>
        </Box>
        </Stack>
      </Paper>
    </Container>
  )
}
