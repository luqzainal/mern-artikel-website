import { Chip } from '@nextui-org/react';
import { ArticleStatus } from '../../types';
import { ARTICLE_STATUSES } from '../../utils/constants';

interface ArticleStatusBadgeProps {
  status: ArticleStatus;
  size?: 'sm' | 'md' | 'lg';
}

export default function ArticleStatusBadge({ status, size = 'sm' }: ArticleStatusBadgeProps) {
  const statusInfo = ARTICLE_STATUSES[status];

  const colorMap: Record<string, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'> = {
    default: 'default',
    primary: 'primary',
    success: 'success',
    warning: 'warning',
    danger: 'danger',
  };

  return (
    <Chip
      size={size}
      color={colorMap[statusInfo.color] || 'default'}
      variant="flat"
    >
      {statusInfo.label}
    </Chip>
  );
}

