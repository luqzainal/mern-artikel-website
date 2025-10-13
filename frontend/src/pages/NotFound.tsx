import { Link } from 'react-router-dom'
import { Button } from '@nextui-org/react'

export default function NotFound() {
  return (
    <div className="container-custom py-16">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you are looking for does not exist.
        </p>
        <Button as={Link} to="/" color="primary">
          Go Home
        </Button>
      </div>
    </div>
  )
}
