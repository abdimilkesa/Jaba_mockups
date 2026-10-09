import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('jaba_user') || 'null') } catch { return null }
  })
  const [checking, setChecking] = useState(Boolean(localStorage.getItem('jaba_token')))

  useEffect(() => {
    const token = localStorage.getItem('jaba_token')
    if (!token) { setChecking(false); return }
    api.get('/auth/me').then(({ data }) => setUser(data.user)).catch(() => {
      localStorage.removeItem('jaba_token'); localStorage.removeItem('jaba_user'); setUser(null)
    }).finally(() => setChecking(false))
  }, [])

  const login = (data) => {
    localStorage.setItem('jaba_token', data.token)
    localStorage.setItem('jaba_user', JSON.stringify(data.user))
    setUser(data.user)
  }
  const logout = () => { localStorage.removeItem('jaba_token'); localStorage.removeItem('jaba_user'); setUser(null) }
  const value = useMemo(() => ({ user, checking, login, logout }), [user, checking])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
