import UserTable from '../components/Users/UserTable';
import UserDetails from '../components/Users/UserDetails';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from '@nextui-org/react';
import { FiPlus } from 'react-icons/fi';
import UserForm from '../components/Users/UserForm';

// Mock user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: { id: string; name: string };
  isActive: boolean;
  createdAt: string;
  profilePicture?: string;
}

export default function UserManagement() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600 mt-2">
            Manage user accounts, roles, and permissions.
          </p>
        </div>
        <Button className="bg-green-500 text-white" startContent={<FiPlus />} onPress={onOpen}>
          Add User
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={selectedUser ? "lg:col-span-2" : "lg:col-span-3"}>
          <UserTable onUserSelect={setSelectedUser} />
        </div>
        <AnimatePresence>
          {selectedUser && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <UserDetails user={selectedUser} onClose={() => setSelectedUser(null)} />
              {/* RoleSelector can be part of UserDetails or separate */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add New User</ModalHeader>
              <ModalBody>
                <UserForm onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
