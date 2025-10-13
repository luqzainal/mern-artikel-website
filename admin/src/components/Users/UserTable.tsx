import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Avatar, Chip, Card, CardHeader, CardBody, Input, Select, SelectItem } from '@nextui-org/react';
import { User } from '../../pages/UserManagement';
import { useState, useMemo } from 'react';
import { FiSearch } from 'react-icons/fi';
import TableSkeleton from '../ui/TableSkeleton';

interface UserTableProps {
  onUserSelect: (user: User) => void;
}

const statusOptions = [
    { key: 'all', label: 'All Statuses' },
    { key: 'active', label: 'Active' },
    { key: 'inactive', label: 'Inactive' },
];

const UserTable = ({ onUserSelect }: UserTableProps) => {
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await api.get('/api/users');
      return Array.isArray(data) ? data : [];
    },
  });

  const { data: roles = [] } = useQuery<any[]>({
    queryKey: ['roles'],
    queryFn: async () => (await api.get('/api/roles')).data,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role.id === roleFilter;
        const matchesStatus = statusFilter === 'all' || (user.isActive && statusFilter === 'active') || (!user.isActive && statusFilter === 'inactive');
        return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  if (isLoading) {
    return <TableSkeleton columns={4} />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex gap-4 w-full">
            <Input
              isClearable
              placeholder="Search by name or email..."
              startContent={<FiSearch />}
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="flex-grow"
            />
            <Select
              placeholder="Filter by role"
              selectedKeys={[roleFilter]}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="max-w-xs"
              items={[{id: 'all', name: 'All Roles'}, ...roles]}
            >
              {(role) => <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>}
            </Select>
            <Select
              placeholder="Filter by status"
              selectedKeys={[statusFilter]}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="max-w-xs"
              items={statusOptions}
            >
              {(item) => <SelectItem key={item.key} value={item.key}>{item.label}</SelectItem>}
            </Select>
        </div>
      </CardHeader>
      <CardBody>
        <Table 
          aria-label="Users table"
          selectionMode="single"
          onRowAction={(key) => {
            const selectedUser = users.find(user => user.id === key);
            if (selectedUser) {
              onUserSelect(selectedUser);
            }
          }}
        >
          <TableHeader>
            <TableColumn>USER</TableColumn>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>ROLE</TableColumn>
            <TableColumn>STATUS</TableColumn>
          </TableHeader>
          <TableBody items={filteredUsers} emptyContent="No users found matching criteria.">
            {(item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar src={item.profilePicture} name={item.name.charAt(0)} size="sm" />
                    <span>{item.name}</span>
                  </div>
                </TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat" color="primary">
                    {item.role.name}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat" color={item.isActive ? 'success' : 'default'}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </Chip>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default UserTable;
