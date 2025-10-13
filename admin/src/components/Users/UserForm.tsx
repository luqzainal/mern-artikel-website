import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import { FiSave } from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';

// Validation Schema
const userSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  roleId: z.string().nonempty('Role is required'),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  onClose: () => void;
}

const UserForm = ({ onClose }: UserFormProps) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: roles = [], isLoading: isLoadingRoles } = useQuery<any[]>({
    queryKey: ['roles'],
    queryFn: async () => (await api.get('/api/roles')).data,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: UserFormData) => api.post('/api/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      showToast('User created successfully!', 'success');
      onClose();
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Error creating user.', 'error');
    },
  });

  const onSubmit = (data: UserFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register('name')}
        label="Full Name"
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
        isRequired
      />
      <Input
        {...register('email')}
        label="Email Address"
        type="email"
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
        isRequired
      />
      <Input
        {...register('password')}
        label="Password"
        type="password"
        isInvalid={!!errors.password}
        errorMessage={errors.password?.message}
        isRequired
      />
      <Select
        {...register('roleId')}
        label="Role"
        isInvalid={!!errors.roleId}
        errorMessage={errors.roleId?.message}
        isLoading={isLoadingRoles}
        isRequired
      >
        {roles.map((role) => (
          <SelectItem key={role.id} value={role.id}>
            {role.name}
          </SelectItem>
        ))}
      </Select>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="flat" color="danger" onPress={onClose}>
          Cancel
        </Button>
        <Button type="submit" color="primary" isLoading={isSubmitting} startContent={<FiSave />}>
          Save User
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
