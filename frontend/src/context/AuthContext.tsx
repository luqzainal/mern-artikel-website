import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import * as api from '../services/api'

interface User {
  id: string
  email: string
  name: string
  profilePicture?: string
  bio?: string
  isActive?: boolean
  createdAt?: string
  role: {
    id: string
    name: string
    permissions: string[]
  }
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  loading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
  hasPermission: (permission: string) => boolean
  hasRole: (role: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const userData = await api.getCurrentUser()
        setUser(userData)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (token: string) => {
    try {
      localStorage.setItem('token', token)
      const userData = await api.getCurrentUser()
      setUser(userData)
      navigate('/')
    } catch (error) {
      console.error('Login failed:', error)
      localStorage.removeItem('token')
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/')
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    const permissions = user.role.permissions as string[]
    return permissions.includes(permission) || user.role.name === 'Admin'
  }

  const hasRole = (role: string): boolean => {
    if (!user) return false
    return user.role.name === role || user.role.name === 'Admin'
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        logout,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
