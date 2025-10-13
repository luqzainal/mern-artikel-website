import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { Card, CardBody, Button } from '@nextui-org/react'
import { FiHome, FiFileText, FiUsers, FiTag, FiCheckSquare, FiImage, FiSettings } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import DashboardHome from './DashboardHome'
import ArticleManagement from './ArticleManagement'
import UserManagement from './UserManagement'
import CategoryTagManagement from './CategoryTagManagement'
import ReviewManagement from './ReviewManagement'
import MediaLibrary from './MediaLibrary'
import Settings from './Settings'

export default function AdminDashboard() {
  const { user, hasRole } = useAuth()
  const location = useLocation()

  // Redirect if not admin/authorized
  if (!user || (!hasRole('Admin') && !hasRole('Reviewer') && !hasRole('Author'))) {
    return (
      <div className="container-custom py-8">
        <Card>
          <CardBody className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-4">You don't have permission to access this area.</p>
            <Button as={Link} to="/" color="primary">
              Go Home
            </Button>
          </CardBody>
        </Card>
      </div>
    )
  }

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: FiHome, roles: ['Admin', 'Reviewer', 'Author'], external: false },
    { path: 'http://localhost:3002/articles', label: 'Articles', icon: FiFileText, roles: ['Admin', 'Author'], external: true },
    { path: '/admin/reviews', label: 'Reviews', icon: FiCheckSquare, roles: ['Admin', 'Reviewer'], external: false },
    { path: '/admin/users', label: 'Users', icon: FiUsers, roles: ['Admin'], external: false },
    { path: '/admin/categories', label: 'Categories & Tags', icon: FiTag, roles: ['Admin'], external: false },
    { path: '/admin/media', label: 'Media Library', icon: FiImage, roles: ['Admin', 'Author'], external: false },
    { path: '/admin/settings', label: 'Settings', icon: FiSettings, roles: ['Admin'], external: false },
  ]

  const filteredMenuItems = menuItems.filter(item =>
    item.roles.some(role => hasRole(role))
  )

  const handleNavigation = (item: typeof menuItems[0]) => {
    if (item.external) {
      window.open(item.path, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container-custom py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {user.role.name} - {user.name}
          </p>
        </div>
      </div>

      <div className="container-custom py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <Card>
              <CardBody className="p-0">
                <nav className="flex flex-col">
                  {filteredMenuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.path

                    if (item.external) {
                      return (
                        <button
                          key={item.path}
                          onClick={() => handleNavigation(item)}
                          className="flex items-center gap-3 px-4 py-3 transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-left w-full"
                        >
                          <Icon size={20} />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      )
                    }

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                          isActive
                            ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400 border-l-4 border-primary-600'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    )
                  })}
                </nav>
              </CardBody>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/articles" element={<ArticleManagement />} />
              <Route path="/reviews" element={<ReviewManagement />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/categories" element={<CategoryTagManagement />} />
              <Route path="/media" element={<MediaLibrary />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  )
}
