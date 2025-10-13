import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Select, SelectItem } from '@nextui-org/react';
import { useToast } from '../../context/ToastContext';

interface Role {
  id: string;
  name: string;
}

interface RoleSelectorProps {
  userId: string;
  currentRoleId: string;
}

const RoleSelector = ({ userId, currentRoleId }: RoleSelectorProps) => {
  const queryClient = useQueryClient();
  const { data: roles = [] } = useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: async () => (await api.get('/api/roles')).data,
  });

  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: (roleId: string) => api.put(`/api/users/${userId}/role`, { roleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      showToast('User role updated successfully!', 'success');
    },
    onError: () => {
      showToast('Error updating user role.', 'error');
    }
  });

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    mutation.mutate(e.target.value);
  };

  return (
    <div>
      <h4 className="font-semibold mb-2">Change Role</h4>
      <Select
        label="User Role"
        placeholder="Select a new role"
        selectedKeys={[currentRoleId]}
        onChange={handleRoleChange}
        isLoading={mutation.isPending}
      >
        {roles.map((role) => (
          <SelectItem key={role.id} value={role.id}>
            {role.name}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default RoleSelector;
