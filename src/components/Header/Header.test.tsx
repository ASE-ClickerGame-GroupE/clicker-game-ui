import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, test, jest, beforeEach } from '@jest/globals'
import { Header } from './Header'
import { BrowserRouter } from 'react-router'

// Mock useAuth hook
const mockLogout = jest.fn()
const mockNavigate = jest.fn()

jest.mock('../../hooks/useAuth/useAuth', () => ({
  useAuth: jest.fn(),
}))

jest.mock('react-router', () => {
  const actual = jest.requireActual('react-router') as typeof import('react-router')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

import { useAuth } from '../../hooks/useAuth/useAuth'

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

const renderHeader = () => {
  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  )
}

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        userId: null,
        isLoadingUser: false,
        token: null,
        login: jest.fn(),
        logout: mockLogout,
      })
    })

    test('renders Play and Leaders navigation links', () => {
      renderHeader()

      expect(screen.getByText('Play')).toBeTruthy()
      expect(screen.getByText('Leaders')).toBeTruthy()
    })

    test('renders login and register icons', () => {
      renderHeader()

      const loginButton = screen.getByLabelText('login')
      const registerButton = screen.getByLabelText('register')

      expect(loginButton).toBeTruthy()
      expect(registerButton).toBeTruthy()
    })

    test('does not render profile icon', () => {
      renderHeader()

      const profileButton = screen.queryByLabelText('profile')
      expect(profileButton).toBeNull()
    })

    test('navigates to login page when login icon is clicked', () => {
      renderHeader()

      const loginButton = screen.getByLabelText('login')
      fireEvent.click(loginButton)

      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })

    test('navigates to register page when register icon is clicked', () => {
      renderHeader()

      const registerButton = screen.getByLabelText('register')
      fireEvent.click(registerButton)

      expect(mockNavigate).toHaveBeenCalledWith('/register')
    })
  })

  describe('when user is authenticated', () => {
    const mockUser = {
      user_id: 'user-123',
      loging: 'TestUser',
      email: 'test@example.com',
      created_at: 1234567890,
    }

    beforeEach(() => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        userId: 'user-123',
        isLoadingUser: false,
        token: 'fake-token',
        login: jest.fn(),
        logout: mockLogout,
      })
    })

    test('renders profile icon instead of login/register icons', () => {
      renderHeader()

      const profileButton = screen.getByLabelText('profile')
      expect(profileButton).toBeTruthy()

      const loginButton = screen.queryByLabelText('login')
      const registerButton = screen.queryByLabelText('register')
      expect(loginButton).toBeNull()
      expect(registerButton).toBeNull()
    })

    test('opens profile popup when profile icon is clicked', async () => {
      renderHeader()

      const profileButton = screen.getByLabelText('profile')
      fireEvent.click(profileButton)

      await waitFor(() => {
        expect(screen.getByText('TestUser')).toBeTruthy()
        expect(screen.getByText('test@example.com')).toBeTruthy()
      })
    })

    test('displays user information in popup', async () => {
      renderHeader()

      const profileButton = screen.getByLabelText('profile')
      fireEvent.click(profileButton)

      await waitFor(() => {
        expect(screen.getByText('Username')).toBeTruthy()
        expect(screen.getByText('TestUser')).toBeTruthy()
        expect(screen.getByText('Email')).toBeTruthy()
        expect(screen.getByText('test@example.com')).toBeTruthy()
      })
    })

    test('has logout button in popup', async () => {
      renderHeader()

      const profileButton = screen.getByLabelText('profile')
      fireEvent.click(profileButton)

      await waitFor(() => {
        const logoutButton = screen.getByText('Logout')
        expect(logoutButton).toBeTruthy()
      })
    })

    test('calls logout and navigates to login when logout is clicked', async () => {
      renderHeader()

      const profileButton = screen.getByLabelText('profile')
      fireEvent.click(profileButton)

      await waitFor(() => {
        const logoutButton = screen.getByText('Logout')
        fireEvent.click(logoutButton)
      })

      expect(mockLogout).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })

    test('closes popup when clicking outside', async () => {
      renderHeader()

      const profileButton = screen.getByLabelText('profile')
      fireEvent.click(profileButton)

      await waitFor(() => {
        expect(screen.getByText('TestUser')).toBeTruthy()
      })

      // Click outside (on backdrop)
      const backdrop = document.querySelector('.MuiBackdrop-root')
      if (backdrop) {
        fireEvent.click(backdrop)
      }

      await waitFor(() => {
        expect(screen.queryByText('TestUser')).toBeNull()
      })
    })
  })

  describe('when user is loading', () => {
    beforeEach(() => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        userId: null,
        isLoadingUser: true,
        token: null,
        login: jest.fn(),
        logout: mockLogout,
      })
    })

    test('does not render auth buttons while loading', () => {
      renderHeader()

      const loginButton = screen.queryByLabelText('login')
      const registerButton = screen.queryByLabelText('register')
      const profileButton = screen.queryByLabelText('profile')

      expect(loginButton).toBeNull()
      expect(registerButton).toBeNull()
      expect(profileButton).toBeNull()
    })

    test('still renders navigation links while loading', () => {
      renderHeader()

      expect(screen.getByText('Play')).toBeTruthy()
      expect(screen.getByText('Leaders')).toBeTruthy()
    })
  })
})

