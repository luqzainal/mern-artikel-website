import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Tag,
  MessageSquare,
  Image,
  Users,
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Avatar, Button } from '@nextui-org/react';
import { formatRoleName } from '../../utils/helpers';

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  path: string;
  label: string;
  icon: any;
  roles: string[];
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'editor', 'author', 'reviewer', 'translator'],
  },
  {
    path: '/articles',
    label: 'Articles',
    icon: FileText,
    roles: ['admin', 'editor', 'author', 'reviewer', 'translator'],
    children: [
      {
        path: '/articles',
        label: 'All Articles',
        icon: FileText,
        roles: ['admin', 'editor', 'author', 'reviewer', 'translator'],
      },
      {
        path: '/articles/new',
        label: 'Add New Article',
        icon: FileText,
        roles: ['admin', 'editor', 'author'],
      },
    ],
  },
  {
    path: '/reviews',
    label: 'Reviews',
    icon: CheckSquare,
    roles: ['admin', 'editor', 'reviewer'],
  },
  {
    path: '/categories',
    label: 'Categories & Tags',
    icon: Tag,
    roles: ['admin', 'editor'],
  },
  {
    path: '/comments',
    label: 'Comments',
    icon: MessageSquare,
    roles: ['admin', 'editor'],
  },
  {
    path: '/media',
    label: 'Media Library',
    icon: Image,
    roles: ['admin', 'editor', 'author'],
  },
  {
    path: '/users',
    label: 'Users',
    icon: Users,
    roles: ['admin'],
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: Settings,
    roles: ['admin', 'editor', 'author', 'reviewer', 'translator'],
  },
];

export default function Sidebar({ isCollapsed, isMobileOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['/articles']);

  // Debug: Log user info
  console.log('Sidebar - User:', user);
  console.log('Sidebar - User Role:', user?.role);

  const toggleMenu = (path: string) => {
    setExpandedMenus(prev =>
      prev.includes(path)
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  const hasAccess = (roles: string[]) => {
    if (!user || !user.role) return false;
    return roles.includes(user.role.toLowerCase());
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const renderMenuItem = (item: MenuItem) => {
    if (!hasAccess(item.roles)) return null;

    const Icon = item.icon;
    const active = isActive(item.path);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.path);

    if (hasChildren) {
      return (
        <div key={item.path}>
          <Button
            onPress={() => toggleMenu(item.path)}
            className={`w-full flex items-center justify-between px-4 py-3 h-auto rounded-none ${
              active
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-l-4 border-primary-600'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 bg-transparent'
            } ${isCollapsed ? 'justify-center' : ''}`}
            variant="light"
            fullWidth
          >
            <div className="flex items-center gap-3 flex-1">
              <Icon size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </div>
            {!isCollapsed && (
              isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
            )}
          </Button>
          
          {!isCollapsed && isExpanded && (
            <div className="bg-gray-50 dark:bg-gray-800/50">
              {item.children?.map(child => {
                if (!hasAccess(child.roles)) return null;
                const childActive = isActive(child.path);
                return (
                  <Link
                    key={child.path}
                    to={child.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-2 pl-12 transition-colors ${
                      childActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-sm font-medium">{child.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-3 transition-colors ${
          active
            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-l-4 border-primary-600'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        } ${isCollapsed ? 'justify-center' : ''}`}
        title={isCollapsed ? item.label : undefined}
      >
        <Icon size={20} className="flex-shrink-0" />
        {!isCollapsed && <span className="font-medium">{item.label}</span>}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out z-20 hidden lg:block ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <nav className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto scrollbar-thin py-4">
            {menuItems.map(renderMenuItem)}
          </div>

          {/* User Profile */}
          {user && (
            <div className={`border-t border-gray-200 dark:border-gray-700 p-4 ${
              isCollapsed ? 'flex justify-center' : ''
            }`}>
              <div className={`flex items-center gap-3 ${isCollapsed ? '' : 'w-full'}`}>
                <Avatar
                  src={user.profilePicture}
                  name={user.name}
                  size="sm"
                  color="primary"
                  isBordered
                />
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {formatRoleName(user.role)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out z-40 lg:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto scrollbar-thin py-4">
            {menuItems.map(renderMenuItem)}
          </div>

          {/* User Profile */}
          {user && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src={user.profilePicture}
                  name={user.name}
                  size="sm"
                  color="primary"
                  isBordered
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {formatRoleName(user.role)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}

