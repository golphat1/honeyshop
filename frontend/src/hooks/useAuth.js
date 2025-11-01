import { useState } from 'react'
import API, { setAccessToken } from '../services/api'

export default function useAuth(){
  const [user, setUser] = useState(null)

  async function login(username, password){
    const res = await API.post('/users/login/', { email: username, password })
    // backend in this guide returns JWT in { token: '...' } OR access/refresh; adapt as needed
    const token = res.data.token || res.data.access
    setAccessToken(token)
    // store refresh token for demo (in production use httpOnly cookie)
    if(res.data.refresh) localStorage.setItem('refresh', res.data.refresh)
    setUser({ username })
  }

  async function register({ username, email, password }){
    await API.post('/users/register/', { username, email, password })
  }

  function logout(){
    setAccessToken(null)
    localStorage.removeItem('refresh')
    setUser(null)
  }

  return { user, login, register, logout, setUser }
}
