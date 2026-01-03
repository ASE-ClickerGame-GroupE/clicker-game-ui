import React from 'react'
import { Box, Button, TextField, Typography, Link } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router'
import { useRegister } from '../../hooks/useRegister/useRegister.ts'

const validateEmail = (v: string) => /\S+@\S+\.\S+/.test(v)
const validatePassword = (v: string) => v.length >= 6 && v.length <= 24

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const { mutate, isPending: loading, error } = useRegister()
  const [login, setLogin] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [repeat, setRepeat] = React.useState('')
  const [touched, setTouched] = React.useState({
    login: false,
    email: false,
    password: false,
    repeat: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ login: true, email: true, password: true, repeat: true })
    if (
      !login ||
      !validateEmail(email) ||
      !validatePassword(password) ||
      password !== repeat
    )
      return
    try {
      mutate({ login, email, password })
      navigate('/login')
    } catch (e) {
      void e
      // error in hook
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
          Register
        </Typography>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          onBlur={() => setTouched((s) => ({ ...s, login: true }))}
          error={touched.login && !login}
          helperText={
            touched.login && !login ? 'Username is required' : ''
          }
        />
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
        <TextField
          label="Repeat Password"
          fullWidth
          margin="normal"
          type="password"
          value={repeat}
          onChange={(e) => setRepeat(e.target.value)}
          onBlur={() => setTouched((s) => ({ ...s, repeat: true }))}
          error={touched.repeat && password !== repeat}
          helperText={
            touched.repeat && password !== repeat ? 'Passwords must match' : ''
          }
        />
        {error && (
          <Typography color="error" mt={1}>
            {error.message}
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
          Register
        </Button>
        <Box mt={2} textAlign="center">
          <Link component={RouterLink} to="/login">
            Have an account? Sign in
          </Link>
        </Box>
      </Box>
    </Box>
  )
}

export default RegisterPage
