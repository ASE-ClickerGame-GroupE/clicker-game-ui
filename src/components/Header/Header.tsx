import React, { useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Popover,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import {
  AccountCircle,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
} from '@mui/icons-material'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../hooks/useAuth/useAuth'

export const Header: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout, isLoadingUser } = useAuth()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleProfileClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleClose()
    navigate('/login')
  }

  const open = Boolean(anchorEl)

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left spacer for balance */}
        <Box sx={{ flex: 1 }} />

        {/* Center navigation */}
        <Stack direction="row" spacing={3} sx={{ flex: 1, justifyContent: 'center' }}>
          <Button
            component={Link}
            to="/"
            color="inherit"
            sx={{
              fontSize: '1rem',
              fontWeight: 500,
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
            }}
          >
            Play
          </Button>
          <Button
            component={Link}
            to="/leaderboards"
            color="inherit"
            sx={{
              fontSize: '1rem',
              fontWeight: 500,
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
            }}
          >
            Leaders
          </Button>
        </Stack>

        {/* Right side - Auth buttons */}
        <Stack direction="row" spacing={1} sx={{ flex: 1, justifyContent: 'flex-end' }}>
          {isLoadingUser ? (
            <Box sx={{ width: 40, height: 40 }} />
          ) : isAuthenticated && user ? (
            <>
              <IconButton
                color="inherit"
                onClick={handleProfileClick}
                aria-label="profile"
                sx={{
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                }}
              >
                <AccountCircle />
              </IconButton>

              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1,
                      bgcolor: 'rgba(15, 23, 42, 0.98)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      minWidth: 200,
                    },
                  },
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Username
                  </Typography>
                  <Typography variant="body1" fontWeight={500} gutterBottom>
                    {user.loging}
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 1 }}>
                    Email
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {user.email}
                  </Typography>

                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={handleLogout}
                    sx={{ mt: 2 }}
                  >
                    Logout
                  </Button>
                </Box>
              </Popover>
            </>
          ) : (
            <>
              <IconButton
                color="inherit"
                onClick={() => navigate('/login')}
                aria-label="login"
                title="Login"
                sx={{
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                }}
              >
                <LoginIcon />
              </IconButton>
              <IconButton
                color="inherit"
                onClick={() => navigate('/register')}
                aria-label="register"
                title="Register"
                sx={{
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                }}
              >
                <RegisterIcon />
              </IconButton>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

