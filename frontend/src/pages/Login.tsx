import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardBody, CardHeader, Input, Button, Divider } from '@nextui-org/react'
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi'
import { FaGoogle } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import axiosInstance from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      })

      const { token, user } = response.data

      // Store token
      localStorage.setItem('token', token)

      // Update auth context
      setUser(user)

      // Force reload to update auth state
      // Redirect based on role
      if (user.role.name === 'Admin') {
        window.location.href = '/admin'
      } else {
        window.location.href = '/'
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-2 items-center py-6">
          <h1 className="text-3xl font-bold text-primary-600">Qalam Al-Ilm</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign in to your account</p>
        </CardHeader>
        <CardBody className="gap-4 px-8 py-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
              <FiAlertCircle className="text-danger-600 dark:text-danger-400 flex-shrink-0" />
              <p className="text-sm text-danger-600 dark:text-danger-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
            <Input
              type="email"
              label="Email"
              placeholder="admin@islamicarticles.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              startContent={<FiMail className="text-gray-400" />}
              required
              variant="bordered"
            />

            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              startContent={<FiLock className="text-gray-400" />}
              required
              variant="bordered"
            />

            <Button
              type="submit"
              color="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full font-semibold"
            >
              Sign In
            </Button>
          </form>

          <div className="relative">
            <Divider />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white dark:bg-gray-800 px-4 text-sm text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="bordered"
            size="lg"
            startContent={<FaGoogle />}
            onClick={handleGoogleLogin}
            className="w-full"
          >
            Sign in with Google
          </Button>

          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <p><span className="font-medium">Admin:</span> admin@islamicarticles.com / Admin123!</p>
              <p><span className="font-medium">Author:</span> author@islamicarticles.com / Author123!</p>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
            <Link to="/" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Back to Home
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  )
}
