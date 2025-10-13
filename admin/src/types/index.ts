// User & Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  googleId?: string;
  role: UserRole;
  profilePicture?: string;
  createdAt: string;
  lastActive?: string;
  isActive: boolean;
}

export type UserRole = 'admin' | 'editor' | 'author' | 'reviewer' | 'translator' | 'reader';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Article Types
export interface Article {
  id: string;
  categoryId: string;
  createdBy: string;
  approvedBy?: string;
  status: ArticleStatus;
  views: number;
  createdAt: string;
  updatedAt: string;
  translations: ArticleTranslation[];
  category?: Category;
  author?: User;
  tags?: Tag[];
}

export type ArticleStatus = 'draft' | 'in_review' | 'approved' | 'published' | 'archived';

export interface ArticleTranslation {
  id: string;
  articleId: string;
  langCode: 'ms' | 'en';
  title: string;
  content: string;
  excerpt?: string;
  references?: Reference[];
  seoMeta?: SEOMeta;
}

export interface Reference {
  type: 'quran' | 'hadith' | 'scholar';
  text: string;
  citation: string;
  source?: string;
}

export interface SEOMeta {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  image?: string;
  articleCount?: number;
  createdAt: string;
  children?: Category[];
}

// Tag Types
export interface Tag {
  id: string;
  name: string;
  slug: string;
  usageCount?: number;
  createdAt: string;
}

// Review Types
export interface Review {
  id: string;
  articleId: string;
  reviewerId: string;
  comments: string;
  status: ReviewStatus;
  reviewedAt: string;
  article?: Article;
  reviewer?: User;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'changes_requested';

// Comment Types
export interface Comment {
  id: string;
  articleId: string;
  userId: string;
  content: string;
  status: CommentStatus;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  article?: Article;
  replies?: Comment[];
}

export type CommentStatus = 'pending' | 'approved' | 'spam' | 'rejected';

// Media Types
export interface Media {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: MediaType;
  fileSize: number;
  mimeType: string;
  dimensions?: {
    width: number;
    height: number;
  };
  uploaderId: string;
  createdAt: string;
  uploader?: User;
  usageCount?: number;
}

export type MediaType = 'image' | 'video' | 'document';

// Dashboard Statistics Types
export interface DashboardStats {
  totalArticles: number;
  totalUsers: number;
  pendingReviews: number;
  totalViews: number;
  totalComments: number;
  totalCategories: number;
  articlesThisMonth: number;
  viewsThisMonth: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
  timestamp: string;
  user?: User;
}

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

// Settings Types
export interface GeneralSettings {
  siteTitle: string;
  siteTagline: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
}

export interface LanguageSettings {
  defaultLanguage: 'ms' | 'en';
  availableLanguages: ('ms' | 'en')[];
  requireAllTranslations: boolean;
}

export interface SEOSettings {
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  defaultKeywords: string[];
  ogImageUrl: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  inAppNotifications: boolean;
  reviewNotifications: boolean;
  commentNotifications: boolean;
  publishNotifications: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter & Sort Types
export interface ArticleFilters {
  status?: ArticleStatus | 'all';
  categoryId?: string;
  authorId?: string;
  language?: 'ms' | 'en' | 'all';
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface TableSort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface TablePagination {
  page: number;
  limit: number;
}

// Toast Notification Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// Form Types
export interface ArticleFormData {
  categoryId: string;
  status: ArticleStatus;
  translations: {
    ms: {
      title: string;
      content: string;
      excerpt: string;
    };
    en: {
      title: string;
      content: string;
      excerpt: string;
    };
  };
  tags: string[];
  references?: Reference[];
  seoMeta?: SEOMeta;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  image?: string;
}

export interface TagFormData {
  name: string;
  slug: string;
}

// Role Permissions
export interface RolePermissions {
  canViewDashboard: boolean;
  canManageArticles: boolean;
  canAddArticles: boolean;
  canEditOwnArticles: boolean;
  canEditAllArticles: boolean;
  canDeleteArticles: boolean;
  canPublishArticles: boolean;
  canReviewArticles: boolean;
  canManageComments: boolean;
  canManageCategories: boolean;
  canManageTags: boolean;
  canManageMedia: boolean;
  canManageUsers: boolean;
  canManageSettings: boolean;
  canViewAnalytics: boolean;
}

