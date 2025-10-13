import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Spinner } from '@nextui-org/react'
import { useAuth } from '../context/AuthContext'

export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      login(token).catch((error) => {
        console.error('Login failed:', error)
        navigate('/')
      })
    } else {
      navigate('/')
    }
  }, [searchParams, login, navigate])

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="text-center">
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-gray-600">Logging in...</p>
      </div>
    </div>
  )
}
