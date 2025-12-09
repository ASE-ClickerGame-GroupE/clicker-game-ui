import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { AuthProvider, useAuth } from './useAuth.tsx'

// Mock js-cookie
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}))

import Cookies from 'js-cookie'

const TestConsumer: React.FC = () => {
  const { token, isAuthenticated, login, logout } = useAuth()
  return (
    <div>
      <div data-testid="token">{token ?? 'null'}</div>
      <div data-testid="isAuthenticated">{String(isAuthenticated)}</div>
      <button onClick={() => login('new-token')}>login</button>
      <button onClick={() => logout()}>logout</button>
    </div>
  )
}

describe('useAuth (cookie-backed)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('reads token from cookie on init', () => {
    ;(Cookies.get as jest.Mock).mockImplementation(() => 'cookie-token')

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    expect(screen.getByTestId('token').textContent).toBe('cookie-token')
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('true')
  })

  it('login sets cookie and updates state', () => {
    ;(Cookies.get as jest.Mock).mockImplementation(() => null)

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    expect(screen.getByTestId('token').textContent).toBe('null')
    fireEvent.click(screen.getByText('login'))

    expect(Cookies.set).toHaveBeenCalledWith('token', 'new-token', expect.any(Object))
    expect(screen.getByTestId('token').textContent).toBe('new-token')
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('true')
  })

  it('logout removes cookie and updates state', () => {
    ;(Cookies.get as jest.Mock).mockImplementation(() => 'cookie-token')

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    expect(screen.getByTestId('isAuthenticated').textContent).toBe('true')
    fireEvent.click(screen.getByText('logout'))
    expect(Cookies.remove).toHaveBeenCalledWith('token', expect.any(Object))
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('false')
  })
})

