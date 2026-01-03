/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import Cookies from 'js-cookie'
import { getMeRequest, type UserResponse } from '../../api/auth/auth'

type AuthContextValue = {
  token: string | null
  isAuthenticated: boolean
  user: UserResponse | null
  userId: string | null
  isLoadingUser: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return Cookies.get('token') || null
    } catch (e) {
      void e
      return null
    }
  })
  const [user, setUser] = useState<UserResponse | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(false)

  // Fetch user data when token exists
  useEffect(() => {
    if (!token) {
      setUser(null)
      return
    }

    const fetchUser = async () => {
      setIsLoadingUser(true)
      try {
        const userData = await getMeRequest()
        setUser(userData)
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        // Token might be invalid, clear it
        setToken(null)
        setUser(null)
        try {
          Cookies.remove('token', { path: '/' })
        } catch (e) {
          void e
        }
      } finally {
        setIsLoadingUser(false)
      }
    }

    void fetchUser()
  }, [token])

  const login = (t: string) => {
    setToken(t)
    try {
      Cookies.set('token', t, { expires: 7, path: '/', sameSite: 'lax' })
    } catch (e) {
      void e
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    try {
      Cookies.remove('token', { path: '/' })
    } catch (e) {
      void e
    }
  }

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: !!token,
      user,
      userId: user?.user_id || null,
      isLoadingUser,
      login,
      logout
    }),
    [token, user, isLoadingUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
