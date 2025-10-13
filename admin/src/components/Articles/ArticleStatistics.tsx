import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
} from '@nextui-org/react';
import { Eye, MessageSquare, ThumbsUp, TrendingUp } from 'lucide-react';
import { formatNumber } from '../../utils/helpers';

interface ArticleStatisticsProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string;
  articleTitle?: string;
  stats?: {
    views: number;
    comments: number;
    likes: number;
    shares: number;
    avgReadTime: number;
    bounceRate: number;
  };
}

export default function ArticleStatistics({
  isOpen,
  onClose,
  articleTitle,
  stats,
}: ArticleStatisticsProps) {
  // Mock data if no stats provided
  const displayStats = stats || {
    views: 1523,
    comments: 45,
    likes: 234,
    shares: 89,
    avgReadTime: 4.5,
    bounceRate: 23,
  };

  const statCards = [
    {
      label: 'Total Views',
      value: formatNumber(displayStats.views),
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      label: 'Comments',
      value: formatNumber(displayStats.comments),
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      label: 'Likes',
      value: formatNumber(displayStats.likes),
      icon: ThumbsUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      label: 'Engagement Rate',
      value: `${((displayStats.comments + displayStats.likes) / displayStats.views * 100).toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold">Article Statistics</h3>
              {articleTitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                  {articleTitle}
                </p>
              )}
            </ModalHeader>
            <ModalBody>
              {/* Statistics Cards Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {statCards.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index} className="shadow-none border border-gray-200 dark:border-gray-700">
                      <CardBody className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                            <Icon size={20} className={stat.color} />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {stat.value}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {stat.label}
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>

              {/* Additional Metrics */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Average Read Time
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {displayStats.avgReadTime} minutes
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Bounce Rate
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {displayStats.bounceRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Total Shares
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatNumber(displayStats.shares)}
                  </span>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

