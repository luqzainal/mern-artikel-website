import { format, formatDistanceToNow } from 'date-fns';
import { UserRole, RolePermissions } from '../types';
import { ROLES } from './constants';

/**
 * Format date to readable string
 */
export const formatDate = (date: string | Date, dateFormat: string = 'dd/MM/yyyy'): string => {
  try {
    return format(new Date(date), dateFormat);
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch (error) {
    return 'Unknown time';
  }
};

/**
 * Format file size to human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Generate slug from string
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  const names = name.split(' ');
  if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

/**
 * Format role name for display
 */
export const formatRoleName = (role: UserRole | string | undefined): string => {
  if (!role) return 'User';
  
  // If role is already in ROLES constant, use it
  if (typeof role === 'string' && role in ROLES) {
    return ROLES[role as UserRole];
  }
  
  // Otherwise, capitalize first letter
  const roleStr = String(role);
  return roleStr.charAt(0).toUpperCase() + roleStr.slice(1);
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Get role permissions based on user role
 */
export const getRolePermissions = (role: UserRole): RolePermissions => {
  const permissions: Record<UserRole, RolePermissions> = {
    admin: {
      canViewDashboard: true,
      canManageArticles: true,
      canAddArticles: true,
      canEditOwnArticles: true,
      canEditAllArticles: true,
      canDeleteArticles: true,
      canPublishArticles: true,
      canReviewArticles: true,
      canManageComments: true,
      canManageCategories: true,
      canManageTags: true,
      canManageMedia: true,
      canManageUsers: true,
      canManageSettings: true,
      canViewAnalytics: true,
    },
    editor: {
      canViewDashboard: true,
      canManageArticles: true,
      canAddArticles: true,
      canEditOwnArticles: true,
      canEditAllArticles: true,
      canDeleteArticles: true,
      canPublishArticles: true,
      canReviewArticles: true,
      canManageComments: true,
      canManageCategories: true,
      canManageTags: true,
      canManageMedia: true,
      canManageUsers: false,
      canManageSettings: false,
      canViewAnalytics: true,
    },
    author: {
      canViewDashboard: true,
      canManageArticles: false,
      canAddArticles: true,
      canEditOwnArticles: true,
      canEditAllArticles: false,
      canDeleteArticles: false,
      canPublishArticles: false,
      canReviewArticles: false,
      canManageComments: false,
      canManageCategories: false,
      canManageTags: false,
      canManageMedia: true,
      canManageUsers: false,
      canManageSettings: false,
      canViewAnalytics: false,
    },
    reviewer: {
      canViewDashboard: true,
      canManageArticles: false,
      canAddArticles: false,
      canEditOwnArticles: false,
      canEditAllArticles: false,
      canDeleteArticles: false,
      canPublishArticles: false,
      canReviewArticles: true,
      canManageComments: false,
      canManageCategories: false,
      canManageTags: false,
      canManageMedia: false,
      canManageUsers: false,
      canManageSettings: false,
      canViewAnalytics: false,
    },
    translator: {
      canViewDashboard: true,
      canManageArticles: false,
      canAddArticles: false,
      canEditOwnArticles: false,
      canEditAllArticles: false,
      canDeleteArticles: false,
      canPublishArticles: false,
      canReviewArticles: false,
      canManageComments: false,
      canManageCategories: false,
      canManageTags: false,
      canManageMedia: false,
      canManageUsers: false,
      canManageSettings: false,
      canViewAnalytics: false,
    },
    reader: {
      canViewDashboard: false,
      canManageArticles: false,
      canAddArticles: false,
      canEditOwnArticles: false,
      canEditAllArticles: false,
      canDeleteArticles: false,
      canPublishArticles: false,
      canReviewArticles: false,
      canManageComments: false,
      canManageCategories: false,
      canManageTags: false,
      canManageMedia: false,
      canManageUsers: false,
      canManageSettings: false,
      canViewAnalytics: false,
    },
  };

  return permissions[role] || permissions.reader;
};

/**
 * Check if user has permission
 */
export const hasPermission = (role: UserRole | undefined, permission: keyof RolePermissions): boolean => {
  if (!role) return false;
  const permissions = getRolePermissions(role);
  if (!permissions) return false;
  return permissions[permission];
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Download file from URL
 */
export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Generate random ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

/**
 * Parse JSON safely
 */
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json);
  } catch (error) {
    return fallback;
  }
};

/**
 * Get contrast color (black or white) based on background color
 */
export const getContrastColor = (hexColor: string): string => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
};

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Sort array by key
 */
export const sortByKey = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

