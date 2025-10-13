import { Card, CardBody, CardHeader, Divider, Chip } from '@nextui-org/react'
import { FiFileText, FiUsers, FiCheckSquare, FiEye } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

export default function DashboardHome() {
  const { user } = useAuth()

  // Mock statistics - will be replaced with real API data
  const stats = [
    {
      title: 'Total Articles',
      value: '0',
      icon: FiFileText,
      color: 'primary',
      description: 'Published articles',
    },
    {
      title: 'Total Users',
      value: '2',
      icon: FiUsers,
      color: 'success',
      description: 'Registered users',
    },
    {
      title: 'Pending Reviews',
      value: '0',
      icon: FiCheckSquare,
      color: 'warning',
      description: 'Articles awaiting review',
    },
    {
      title: 'Total Views',
      value: '0',
      icon: FiEye,
      color: 'secondary',
      description: 'All-time page views',
    },
  ]

  const recentActivities = [
    {
      type: 'info',
      message: 'System initialized successfully',
      time: 'Just now',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card>
        <CardBody className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with Qalam Al-Ilm today.
          </p>
        </CardBody>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="card-hover">
              <CardBody className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900`}
                  >
                    <Icon className={`text-${stat.color}-600 dark:text-${stat.color}-400`} size={24} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {stat.description}
                </p>
              </CardBody>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-0 pt-6 px-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
          </CardHeader>
          <Divider className="my-4" />
          <CardBody className="px-6 pb-6">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-2 h-2 rounded-full bg-${activity.type === 'success' ? 'green' : activity.type === 'warning' ? 'yellow' : 'blue'}-500`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-0 pt-6 px-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Start Guide
            </h3>
          </CardHeader>
          <Divider className="my-4" />
          <CardBody className="px-6 pb-6">
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  1. Create your first article
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Go to Articles → Create New Article
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  2. Manage categories
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Organize your content with categories and tags
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  3. Review workflow
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Submit articles for review and approval
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader className="pb-0 pt-6 px-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            System Status
          </h3>
        </CardHeader>
        <Divider className="my-4" />
        <CardBody className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Database
              </span>
              <Chip color="success" size="sm" variant="flat">
                Online
              </Chip>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                API Server
              </span>
              <Chip color="success" size="sm" variant="flat">
                Online
              </Chip>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Frontend
              </span>
              <Chip color="success" size="sm" variant="flat">
                Online
              </Chip>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
