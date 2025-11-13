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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-700 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md mx-4 shadow-2xl relative z-10 backdrop-blur-sm bg-white/95">
        <CardBody className="p-10">
          {/* Logo/Icon Section */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-10 w-10 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                />
              </svg>
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Admin Portal
            </h1>
            <h2 className="text-xl font-semibold text-teal-600 mb-1">
              Qalam Al-Ilm
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Secure Admin Access
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <Input
                type="email"
                label="Email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                size="lg"
                variant="bordered"
                classNames={{
                  input: "text-base",
                  inputWrapper: "border-gray-300 hover:border-teal-500 focus-within:border-teal-500 h-12"
                }}
                startContent={
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                    />
                  </svg>
                }
              />
            </div>

            <div className="space-y-1">
              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                size="lg"
                variant="bordered"
                classNames={{
                  input: "text-base",
                  inputWrapper: "border-gray-300 hover:border-teal-500 focus-within:border-teal-500 h-12"
                }}
                startContent={
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                    />
                  </svg>
                }
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
              isLoading={loading}
              size="lg"
              endContent={
                !loading && (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M14 5l7 7m0 0l-7 7m7-7H3" 
                    />
                  </svg>
                )
              }
            >
              {loading ? 'Logging in...' : 'Log Masuk'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              © 2024 Qalam Al-Ilm. All rights reserved.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
