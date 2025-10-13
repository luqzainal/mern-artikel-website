import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Avatar, Spinner, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react'
import { useLanguage } from '../common/LanguageToggle'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUsers, updateUser, deleteUser } from '../../services/api'
import { FiMoreVertical, FiTrash2, FiUserCheck, FiUserX } from 'react-icons/fi'

export default function UserManagement() {
  const { language } = useLanguage()
  const queryClient = useQueryClient()

  // Fetch users from API
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => getUsers(),
  })

  const users = Array.isArray(usersData) ? usersData : []

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })

  const handleToggleStatus = (userId: string, currentStatus: boolean) => {
    updateMutation.mutate({ id: userId, data: { isActive: !currentStatus } })
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm(language === 'EN' ? 'Are you sure you want to delete this user?' : 'Adakah anda pasti untuk memadam pengguna ini?')) {
      deleteMutation.mutate(userId)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{language === 'EN' ? 'User Management' : 'Pengurusan Pengguna'}</h2>
      <Card>
        <CardHeader className="pb-0 pt-6 px-6">
          <h3 className="text-lg font-semibold">{language === 'EN' ? 'Users' : 'Pengguna'}</h3>
        </CardHeader>
        <CardBody className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" color="primary" />
            </div>
          ) : (
            <Table aria-label="Users table">
              <TableHeader>
                <TableColumn>{language === 'EN' ? 'USER' : 'PENGGUNA'}</TableColumn>
                <TableColumn>EMAIL</TableColumn>
                <TableColumn>{language === 'EN' ? 'ROLE' : 'PERANAN'}</TableColumn>
                <TableColumn>{language === 'EN' ? 'STATUS' : 'STATUS'}</TableColumn>
                <TableColumn>{language === 'EN' ? 'ACTIONS' : 'TINDAKAN'}</TableColumn>
              </TableHeader>
              <TableBody emptyContent={language === 'EN' ? 'No users found' : 'Tiada pengguna dijumpai'}>
                {users.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={user.profilePicture}
                          name={user.name}
                          size="sm"
                        />
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip size="sm" color="primary" variant="flat">
                        {user.role?.name || 'Unknown'}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip size="sm" color={user.isActive ? 'success' : 'default'} variant="flat">
                        {user.isActive
                          ? (language === 'EN' ? 'Active' : 'Aktif')
                          : (language === 'EN' ? 'Inactive' : 'Tidak Aktif')
                        }
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly size="sm" variant="light">
                            <FiMoreVertical />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="User actions">
                          <DropdownItem
                            key="toggle-status"
                            startContent={user.isActive ? <FiUserX /> : <FiUserCheck />}
                            onClick={() => handleToggleStatus(user.id, user.isActive)}
                          >
                            {user.isActive
                              ? (language === 'EN' ? 'Deactivate' : 'Nyahaktifkan')
                              : (language === 'EN' ? 'Activate' : 'Aktifkan')
                            }
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            className="text-danger"
                            color="danger"
                            startContent={<FiTrash2 />}
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            {language === 'EN' ? 'Delete' : 'Padam'}
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
