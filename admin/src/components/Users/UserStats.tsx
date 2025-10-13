import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Spinner } from '@nextui-org/react';
import { FiFileText, FiCheckSquare, FiMessageCircle } from 'react-icons/fi';

interface UserStatsProps {
  userId: string;
}

const StatCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: number }) => (
  <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
    <Icon className="text-2xl text-primary" />
    <div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  </div>
);

const UserStats = ({ userId }: UserStatsProps) => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['user-stats', userId],
    queryFn: async () => {
      // This endpoint is hypothetical and needs to be created in the backend
      const { data } = await api.get(`/api/users/${userId}/stats`);
      return data;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24">
        <Spinner size="sm" />
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-semibold mb-2">User Statistics</h4>
      <div className="grid grid-cols-3 gap-2">
        <StatCard icon={FiFileText} label="Articles" value={stats?.articles || 0} />
        <StatCard icon={FiCheckSquare} label="Reviews" value={stats?.reviews || 0} />
        <StatCard icon={FiMessageCircle} label="Comments" value={stats?.comments || 0} />
      </div>
    </div>
  );
};

export default UserStats;
