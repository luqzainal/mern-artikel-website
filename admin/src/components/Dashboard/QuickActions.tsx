import { Card, CardBody, Button } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Eye, MessageSquare, Upload } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { hasPermission } from '../../utils/helpers';

export default function QuickActions() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user || !user.role) return null;

  const actions = [
    {
      label: 'Add New Article',
      icon: Plus,
      className: 'bg-green-500 text-white',
      path: '/articles/new',
      permission: 'canAddArticles',
    },
    {
      label: 'View All Articles',
      icon: FileText,
      color: 'secondary' as const,
      path: '/articles',
      permission: 'canViewDashboard',
    },
    {
      label: 'Pending Reviews',
      icon: Eye,
      color: 'warning' as const,
      path: '/reviews',
      permission: 'canReviewArticles',
    },
    {
      label: 'Moderate Comments',
      icon: MessageSquare,
      color: 'success' as const,
      path: '/comments',
      permission: 'canManageComments',
    },
    {
      label: 'Media Library',
      icon: Upload,
      color: 'default' as const,
      path: '/media',
      permission: 'canManageMedia',
    },
  ];

  const availableActions = actions.filter((action) =>
    hasPermission(user.role, action.permission as any)
  );

  if (availableActions.length === 0) return null;

  return (
    <Card>
      <CardBody className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.path}
                color={(action as any).color}
                className={(action as any).className || 'justify-start h-auto py-3'}
                variant="flat"
                startContent={<Icon size={18} />}
                onPress={() => navigate(action.path)}
              >
                {action.label}
              </Button>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}

