import { createContext, useContext, useState } from 'react'
import api from '../api/client' 

type User = { username: string, email?: string } | null

const AuthContext = createContext<any>(null)

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User>(null)
  const login = async (username:string, password:string) => {
    const res = await api.post('/api/v1/auth/login', { username, password })
    const token = res?.data?.token
    if(token){
      localStorage.setItem('token', token)
      setUser({ username })
      return { success: true }
    }
    return { success: false }
  }
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }
  const register = async (payload:any) => {
    const res = await api.post('/api/v1/auth/register', payload)
    return res.data
  }
  return <AuthContext.Provider value={{ user, login, logout, register }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
