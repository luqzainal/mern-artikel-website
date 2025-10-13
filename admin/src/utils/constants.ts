import { UserRole, ArticleStatus, CommentStatus, ReviewStatus } from '../types';

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Auth Constants
export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';

// Role Definitions
export const ROLES: Record<UserRole, string> = {
  admin: 'Admin',
  editor: 'Editor',
  author: 'Author',
  reviewer: 'Reviewer',
  translator: 'Translator',
  reader: 'Reader',
};

// Article Status Definitions
export const ARTICLE_STATUSES: Record<ArticleStatus, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'default' },
  in_review: { label: 'In Review', color: 'warning' },
  approved: { label: 'Approved', color: 'success' },
  published: { label: 'Published', color: 'primary' },
  archived: { label: 'Archived', color: 'default' },
};

// Review Status Definitions
export const REVIEW_STATUSES: Record<ReviewStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'warning' },
  approved: { label: 'Approved', color: 'success' },
  rejected: { label: 'Rejected', color: 'danger' },
  changes_requested: { label: 'Changes Requested', color: 'warning' },
};

// Comment Status Definitions
export const COMMENT_STATUSES: Record<CommentStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'warning' },
  approved: { label: 'Approved', color: 'success' },
  spam: { label: 'Spam', color: 'danger' },
  rejected: { label: 'Rejected', color: 'danger' },
};

// Language Options
export const LANGUAGES = [
  { code: 'ms', label: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Date Formats
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';

// Toast Duration
export const TOAST_DURATION = 5000; // 5 seconds

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

// Editor Config
export const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ['link', 'image', 'video'],
    ['blockquote', 'code-block'],
    ['clean'],
  ],
};

// Navigation Menu Items (will be filtered by role)
export const MENU_ITEMS = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    roles: ['admin', 'editor', 'author', 'reviewer', 'translator'],
  },
  {
    path: '/articles',
    label: 'Articles',
    icon: 'FileText',
    roles: ['admin', 'editor', 'author', 'reviewer', 'translator'],
    children: [
      {
        path: '/articles',
        label: 'All Articles',
        roles: ['admin', 'editor', 'author', 'reviewer', 'translator'],
      },
      {
        path: '/articles/new',
        label: 'Add New Article',
        roles: ['admin', 'editor', 'author'],
      },
    ],
  },
  {
    path: '/reviews',
    label: 'Reviews',
    icon: 'CheckSquare',
    roles: ['admin', 'editor', 'reviewer'],
  },
  {
    path: '/categories',
    label: 'Categories & Tags',
    icon: 'Tag',
    roles: ['admin', 'editor'],
  },
  {
    path: '/comments',
    label: 'Comments',
    icon: 'MessageSquare',
    roles: ['admin', 'editor'],
  },
  {
    path: '/media',
    label: 'Media Library',
    icon: 'Image',
    roles: ['admin', 'editor', 'author'],
  },
  {
    path: '/users',
    label: 'Users',
    icon: 'Users',
    roles: ['admin'],
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: 'Settings',
    roles: ['admin', 'editor', 'author', 'reviewer', 'translator'],
  },
];

// Chart Colors
export const CHART_COLORS = {
  primary: '#007373',
  secondary: '#ff9800',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899',
};

