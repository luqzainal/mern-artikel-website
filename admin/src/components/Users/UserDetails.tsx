import { Card, CardBody, CardHeader, Avatar, Button, Chip, Divider } from '@nextui-org/react';
import { FiX, FiMail, FiShield, FiCalendar, FiUserCheck, FiUserX } from 'react-icons/fi';
import { User } from '../../pages/UserManagement';
import RoleSelector from './RoleSelector';
import UserStats from './UserStats';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface UserDetailsProps {
  user: User;
  onClose: () => void;
}

const UserDetails = ({ user, onClose }: UserDetailsProps) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const toggleStatusMutation = useMutation({
    mutationFn: () => api.put(`/api/users/${user.id}/status`, { isActive: !user.isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      showToast('User status updated successfully!', 'success');
    },
    onError: () => {
      showToast('Error updating user status.', 'error');
    }
  });

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">User Details</h3>
        <Button isIconOnly size="sm" variant="light" onPress={onClose}>
          <FiX />
        </Button>
      </CardHeader>
      <CardBody className="space-y-6">
        <div className="flex flex-col items-center">
          <Avatar src={user.profilePicture} name={user.name.charAt(0)} size="lg" />
          <h4 className="mt-2 text-xl font-bold">{user.name}</h4>
          <Chip 
            size="sm" 
            variant="flat" 
            color={user.isActive ? 'success' : 'default'} 
            className="mt-1"
          >
            {user.isActive ? 'Active' : 'Inactive'}
          </Chip>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <FiMail className="text-gray-500" />
            <span className="text-sm">{user.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <FiShield className="text-gray-500" />
            <span className="text-sm">{user.role.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <FiCalendar className="text-gray-500" />
            <span className="text-sm">Joined on {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <Divider />
        <UserStats userId={user.id} />
        <Divider />
        <RoleSelector userId={user.id} currentRoleId={user.role.id} />
        <Divider />
        <div>
          <h4 className="font-semibold mb-2">Actions</h4>
          <Button
            fullWidth
            color={user.isActive ? 'warning' : 'success'}
            variant="flat"
            startContent={user.isActive ? <FiUserX /> : <FiUserCheck />}
            isLoading={toggleStatusMutation.isPending}
            onPress={() => toggleStatusMutation.mutate()}
          >
            {user.isActive ? 'Deactivate User' : 'Activate User'}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default UserDetails;
