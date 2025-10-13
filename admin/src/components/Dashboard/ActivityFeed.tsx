import { Card, CardBody, Divider, Avatar } from '@nextui-org/react';
import { formatRelativeTime } from '../../utils/helpers';
import { ActivityLog } from '../../types';

interface ActivityFeedProps {
  activities: ActivityLog[];
  isLoading?: boolean;
}

const getActivityIcon = (action: string) => {
  if (action.includes('create') || action.includes('add')) return '➕';
  if (action.includes('update') || action.includes('edit')) return '✏️';
  if (action.includes('delete') || action.includes('remove')) return '🗑️';
  if (action.includes('publish')) return '📢';
  if (action.includes('approve')) return '✅';
  if (action.includes('reject')) return '❌';
  if (action.includes('review')) return '👁️';
  return '📝';
};

const getActivityColor = (action: string) => {
  if (action.includes('create') || action.includes('add')) return 'text-green-600 dark:text-green-400';
  if (action.includes('update') || action.includes('edit')) return 'text-blue-600 dark:text-blue-400';
  if (action.includes('delete') || action.includes('remove')) return 'text-red-600 dark:text-red-400';
  if (action.includes('publish')) return 'text-purple-600 dark:text-purple-400';
  if (action.includes('approve')) return 'text-green-600 dark:text-green-400';
  if (action.includes('reject')) return 'text-red-600 dark:text-red-400';
  return 'text-gray-600 dark:text-gray-400';
};

export default function ActivityFeed({ activities, isLoading = false }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <Card>
        <CardBody className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <Divider className="mb-4" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardBody className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <Divider className="mb-4" />
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <Divider className="mb-4" />
        <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              {activity.user?.profilePicture ? (
                <Avatar
                  src={activity.user.profilePicture}
                  name={activity.user.name}
                  size="sm"
                />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                  {getActivityIcon(activity.action)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{activity.user?.name || 'System'}</span>
                  {' '}
                  <span className={getActivityColor(activity.action)}>
                    {activity.description}
                  </span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

