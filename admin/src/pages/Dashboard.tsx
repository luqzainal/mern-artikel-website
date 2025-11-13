import { Card, CardBody } from '@nextui-org/react';
import { FileText, Users, CheckSquare, Eye, MessageSquare, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import Breadcrumb from '../components/Layout/Breadcrumb';
import StatisticsCard from '../components/Dashboard/StatisticsCard';
import ActivityFeed from '../components/Dashboard/ActivityFeed';
import ChartSection from '../components/Dashboard/ChartSection';
import CalendarView from '../components/Dashboard/CalendarView';
import QuickActions from '../components/Dashboard/QuickActions';
import { DashboardStats, ActivityLog, ChartData } from '../types';
import { getDashboardStats, getArticlesByCategory, getArticlesByStatus, getRecentActivities } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });

  // Fetch recent activities
  const { data: activities = [], isLoading: activitiesLoading } = useQuery<ActivityLog[]>({
    queryKey: ['recent-activities'],
    queryFn: getRecentActivities,
  });

  // Fetch chart data
  const { data: articlesByCategoryRaw = [], isLoading: chartLoading } = useQuery({
    queryKey: ['articles-by-category'],
    queryFn: getArticlesByCategory,
  });

  // Transform category data to match ChartData format
  const articlesByCategory: ChartData[] = articlesByCategoryRaw.map((item: any) => ({
    label: item.name,
    value: item.value,
  }));

  const { data: articlesByStatusRaw = [], isLoading: statusChartLoading } = useQuery({
    queryKey: ['articles-by-status'],
    queryFn: getArticlesByStatus,
  });

  // Transform status data to match ChartData format with colors
  const statusColors: Record<string, string> = {
    PUBLISHED: '#10b981',
    REVIEW: '#f59e0b',
    DRAFT: '#6b7280',
    ARCHIVED: '#ef4444',
  };

  const articlesByStatus: ChartData[] = articlesByStatusRaw.map((item: any) => ({
    label: item.name,
    value: item.value,
    color: statusColors[item.name] || '#6b7280',
  }));

  // Fetch calendar events
  const { data: calendarEvents = [], isLoading: calendarLoading } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return [
        {
          id: '1',
          title: 'Publish: Islamic Finance Article',
          start: new Date(2025, 9, 15, 10, 0),
          end: new Date(2025, 9, 15, 11, 0),
          type: 'article' as const,
        },
        {
          id: '2',
          title: 'Review Meeting',
          start: new Date(2025, 9, 18, 14, 0),
          end: new Date(2025, 9, 18, 15, 0),
          type: 'meeting' as const,
        },
      ];
    },
  });

  const statsCards = [
    {
      title: 'Total Articles',
      value: stats?.totalArticles || 0,
      icon: FileText,
      color: 'primary' as const,
      description: 'Published articles',
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'success' as const,
      description: 'Registered users',
    },
    {
      title: 'Pending Reviews',
      value: stats?.pendingReviews || 0,
      icon: CheckSquare,
      color: 'warning' as const,
      description: 'Awaiting review',
      trend: { value: 3, isPositive: false },
    },
    {
      title: 'Total Views',
      value: stats?.totalViews || 0,
      icon: Eye,
      color: 'info' as const,
      description: 'All-time views',
      trend: { value: 8, isPositive: true },
    },
    {
      title: 'Comments',
      value: stats?.totalComments || 0,
      icon: MessageSquare,
      color: 'secondary' as const,
      description: 'Total comments',
    },
    {
      title: 'Monthly Growth',
      value: stats?.articlesThisMonth || 0,
      icon: TrendingUp,
      color: 'success' as const,
      description: 'Articles this month',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Welcome Card */}
      <Card>
        <CardBody className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Selamat Kembali, {user?.name || 'User'}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Berikut adalah ringkasan aktiviti Qalam Al-Ilm hari ini.
          </p>
        </CardBody>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsCards.map((stat, index) => (
          <StatisticsCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
            isLoading={statsLoading}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSection
          title="Articles by Category"
          data={articlesByCategory}
          type="pie"
          isLoading={chartLoading}
        />
        <ChartSection
          title="Articles by Status"
          data={articlesByStatus}
          type="bar"
          isLoading={statusChartLoading}
        />
      </div>

      {/* Activity Feed & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed activities={activities} isLoading={activitiesLoading} />
        <CalendarView events={calendarEvents} isLoading={calendarLoading} />
      </div>
    </div>
  );
}
