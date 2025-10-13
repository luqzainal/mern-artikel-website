import { LucideIcon } from 'lucide-react';
import { Card, CardBody } from '@nextui-org/react';

interface StatisticsCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
}

const colorClasses = {
  primary: 'bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400',
  secondary: 'bg-secondary-100 text-secondary-600 dark:bg-secondary-900/20 dark:text-secondary-400',
  success: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
  danger: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
};

export default function StatisticsCard({
  title,
  value,
  description,
  icon: Icon,
  color = 'primary',
  trend,
  isLoading = false,
}: StatisticsCardProps) {
  if (isLoading) {
    return (
      <Card className="card-hover">
        <CardBody className="p-6">
          <div className="animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-1"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="card-hover">
      <CardBody className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon size={24} />
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                trend.isPositive
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>

        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          {title}
        </p>

        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {description}
          </p>
        )}
      </CardBody>
    </Card>
  );
}

