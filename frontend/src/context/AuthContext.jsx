import React, { createContext, useState, useEffect } from 'react'
import api from '../services/api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null) // could store username/email

  useEffect(() => {
    const access = localStorage.getItem('access')
    if (access) setUser({ token: access })
  }, [])

  async function login(email, password) {
    const res = await api.post('/users/login/', { email, password })
    // backend could return { token } or { access, refresh } — handle both
    const token = res.data.token || res.data.access
    const refresh = res.data.refresh
    if (token) localStorage.setItem('access', token)
    if (refresh) localStorage.setItem('refresh', refresh)
    setUser({ email })
    return res.data
  }

  async function register(payload) {
    return api.post('/users/register/', payload)
  }

  function logout() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
