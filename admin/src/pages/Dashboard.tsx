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

export default function Dashboard() {
  const { user } = useAuth();

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return {
        totalArticles: 45,
        totalUsers: 12,
        pendingReviews: 8,
        totalViews: 15234,
        totalComments: 127,
        totalCategories: 8,
        articlesThisMonth: 12,
        viewsThisMonth: 3421,
      };
    },
  });

  // Fetch recent activities
  const { data: activities = [], isLoading: activitiesLoading } = useQuery<ActivityLog[]>({
    queryKey: ['recent-activities'],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return [
        {
          id: '1',
          userId: '1',
          action: 'create',
          entityType: 'article',
          entityId: '1',
          description: 'created a new article "Introduction to Islamic Finance"',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          user: {
            id: '1',
            name: 'Ahmad Ibrahim',
            email: 'ahmad@example.com',
            role: 'author',
            isActive: true,
            createdAt: new Date().toISOString(),
          },
        },
        {
          id: '2',
          userId: '2',
          action: 'approve',
          entityType: 'review',
          entityId: '2',
          description: 'approved an article for publication',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          user: {
            id: '2',
            name: 'Fatimah Ali',
            email: 'fatimah@example.com',
            role: 'editor',
            isActive: true,
            createdAt: new Date().toISOString(),
          },
        },
        {
          id: '3',
          userId: '3',
          action: 'publish',
          entityType: 'article',
          entityId: '3',
          description: 'published an article "Understanding Zakat"',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          user: {
            id: '3',
            name: 'Muhammad Hassan',
            email: 'muhammad@example.com',
            role: 'admin',
            isActive: true,
            createdAt: new Date().toISOString(),
          },
        },
      ];
    },
  });

  // Fetch chart data
  const { data: articlesByCategory = [], isLoading: chartLoading } = useQuery<ChartData[]>({
    queryKey: ['articles-by-category'],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return [
        { label: 'Fiqh', value: 15 },
        { label: 'Aqidah', value: 12 },
        { label: 'Hadith', value: 10 },
        { label: 'Tafsir', value: 8 },
      ];
    },
  });

  const { data: articlesByStatus = [], isLoading: statusChartLoading } = useQuery<ChartData[]>({
    queryKey: ['articles-by-status'],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return [
        { label: 'Published', value: 25, color: '#10b981' },
        { label: 'In Review', value: 8, color: '#f59e0b' },
        { label: 'Draft', value: 12, color: '#6b7280' },
      ];
    },
  });

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
