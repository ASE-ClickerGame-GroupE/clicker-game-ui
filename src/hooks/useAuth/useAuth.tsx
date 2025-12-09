/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import Cookies from 'js-cookie'

type AuthContextValue = {
  token: string | null
  isAuthenticated: boolean
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

  const login = (t: string) => {
    setToken(t)
    try {
      // set cookie for 7 days; SameSite Lax
      Cookies.set('token', t, { expires: 7, path: '/', sameSite: 'lax' })
    } catch (e) {
      void e
    }
  }

  const logout = () => {
    setToken(null)
    try {
      Cookies.remove('token', { path: '/' })
    } catch (e) {
      void e
    }
  }

  const value = useMemo(
    () => ({ token, isAuthenticated: !!token, login, logout }),
    [token]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
