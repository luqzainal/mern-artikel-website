import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  articles: 'Articles',
  new: 'Add New Article',
  edit: 'Edit Article',
  reviews: 'Reviews',
  categories: 'Categories & Tags',
  comments: 'Comments',
  media: 'Media Library',
  users: 'Users',
  settings: 'Settings',
};

export default function Breadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/dashboard' },
  ];

  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    // Don't add link for the last item (current page)
    if (index === pathSegments.length - 1) {
      breadcrumbs.push({ label });
    } else {
      breadcrumbs.push({ label, path: currentPath });
    }
  });

  // Don't show breadcrumb if only on home/dashboard
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight size={16} className="mx-2 text-gray-400" />
          )}
          {item.path ? (
            <Link
              to={item.path}
              className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {index === 0 && <Home size={16} />}
              <span>{item.label}</span>
            </Link>
          ) : (
            <span className="flex items-center gap-1 text-gray-900 dark:text-white font-medium">
              {index === 0 && <Home size={16} />}
              <span>{item.label}</span>
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

