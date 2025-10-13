import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody, Input, Button } from '@nextui-org/react'
import { toast } from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { login } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const { login: authLogin } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await login(email, password)
      
      // Ensure user object has required fields
      if (!data.user || !data.token) {
        throw new Error('Invalid response from server')
      }
      
      // Ensure user has a role (default to 'admin' if missing)
      const user = {
        ...data.user,
        role: data.user.role || data.user.roleId || 'admin',
        name: data.user.name || data.user.email?.split('@')[0] || 'User',
        email: data.user.email || email,
        id: data.user.id || '1',
        isActive: data.user.isActive !== undefined ? data.user.isActive : true,
        createdAt: data.user.createdAt || new Date().toISOString(),
      }
      
      authLogin(data.token, user)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (err: any) {
      console.error('Login error:', err)
      toast.error(err.response?.data?.message || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardBody className="p-8">
          <h1 className="text-2xl font-bold text-center mb-2">
            Admin Portal
          </h1>
          <h2 className="text-xl font-semibold text-primary-600 text-center mb-6">
            Qalam Al-Ilm
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={loading}
            >
              Log Masuk
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
