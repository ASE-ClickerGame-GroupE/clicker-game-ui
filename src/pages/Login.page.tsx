import React from 'react'
import { Box, Button, TextField, Typography, Link } from '@mui/material'
import { useNavigate, Link as RouterLink, useLocation } from 'react-router'
import { useLogin } from '../hooks/useLogin'

const validateEmail = (v: string) => /\S+@\S+\.\S+/.test(v)
const validatePassword = (v: string) => v.length >= 6 && v.length <= 24

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { mutateAsync, isPending: loading, error } = useLogin()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [touched, setTouched] = React.useState({
    email: false,
    password: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    if (!validateEmail(email) || !validatePassword(password)) return
    try {
      await mutateAsync({ email, password })
      // redirect back to the page the user wanted to access
      const dest = location.state?.from?.pathname || '/'
      navigate(dest)
    } catch (e) {
      void e
      // error handled in hook
    }
  }

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ px: 2 }}
    >
      <Box component="form" onSubmit={handleSubmit} width={400}>
        <Typography variant="h4" mb={2}>
          Login
        </Typography>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((s) => ({ ...s, email: true }))}
          error={touched.email && !validateEmail(email)}
          helperText={
            touched.email && !validateEmail(email) ? 'Enter a valid email' : ''
          }
        />
        <TextField
          label="Password"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setTouched((s) => ({ ...s, password: true }))}
          error={touched.password && !validatePassword(password)}
          helperText={
            touched.password && !validatePassword(password)
              ? 'Password 6-24 characters'
              : ''
          }
        />
        {error && (
          <Typography color="error" mt={1}>
            {error?.message}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          Sign in
        </Button>
        <Box mt={2} textAlign="center">
          <Link component={RouterLink} to="/register">
            Don't have an account? Register
          </Link>
        </Box>
      </Box>
    </Box>
  )
}

export default LoginPage
