import { useState } from 'react';
import { 
  Avatar, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem,
  Badge,
  Button
} from '@nextui-org/react';
import { 
  Menu, 
  Bell, 
  LogOut, 
  User, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { formatRoleName } from '../../utils/helpers';

interface HeaderProps {
  onMenuClick: () => void;
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export default function Header({ onMenuClick, onToggleSidebar, isSidebarCollapsed }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notificationCount] = useState(3); // Mock notification count

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/settings');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={24} className="text-gray-700 dark:text-gray-300" />
          </button>

          {/* Desktop Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            {isSidebarCollapsed ? (
              <ChevronRight size={24} className="text-gray-700 dark:text-gray-300" />
            ) : (
              <ChevronLeft size={24} className="text-gray-700 dark:text-gray-300" />
            )}
          </button>

          {/* Logo & Title */}
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Admin Panel
            </h1>
           {/* <p className="text-xs text-primary-600 dark:text-primary-400">
              Qalam Al-Ilm
            </p> */}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Badge 
                content={notificationCount > 0 ? notificationCount : undefined} 
                color="danger" 
                size="sm"
                isInvisible={notificationCount === 0}
              >
                <Button
                  isIconOnly
                  variant="light"
                  aria-label="Notifications"
                >
                  <Bell size={20} className="text-gray-700 dark:text-gray-300" />
                </Button>
              </Badge>
            </DropdownTrigger>
            <DropdownMenu aria-label="Notifications">
              <DropdownItem key="notification1" className="py-3">
                <div>
                  <p className="font-medium text-sm">New article submitted</p>
                  <p className="text-xs text-gray-500">John Doe submitted an article for review</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
              </DropdownItem>
              <DropdownItem key="notification2" className="py-3">
                <div>
                  <p className="font-medium text-sm">Comment pending approval</p>
                  <p className="text-xs text-gray-500">New comment on "Islamic Finance"</p>
                  <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                </div>
              </DropdownItem>
              <DropdownItem key="notification3" className="py-3">
                <div>
                  <p className="font-medium text-sm">Review assigned</p>
                  <p className="text-xs text-gray-500">You have been assigned to review an article</p>
                  <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          {/* User Menu */}
          {user && (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <Avatar
                    src={user.profilePicture}
                    name={user.name}
                    size="sm"
                    color="primary"
                    isBordered
                    className="cursor-pointer"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatRoleName(user.role)}
                    </p>
                  </div>
                </button>
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions">
                <DropdownItem key="profile" className="h-14 gap-2" textValue="Profile">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </DropdownItem>
                <DropdownItem
                  key="settings"
                  startContent={<User size={16} />}
                  onClick={handleProfile}
                >
                  Profile Settings
                </DropdownItem>
                <DropdownItem
                  key="preferences"
                  startContent={<Settings size={16} />}
                  onClick={() => navigate('/settings')}
                >
                  Preferences
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  startContent={<LogOut size={16} />}
                  onClick={handleLogout}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>
    </header>
  );
}

