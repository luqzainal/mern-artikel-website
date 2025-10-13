import axios, { AxiosInstance } from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const getCurrentUser = async () => {
  const { data } = await axiosInstance.get('/auth/me')
  return data
}

export const googleLogin = () => {
  window.location.href = `${API_URL}/api/auth/google`
}

export const logout = async () => {
  await axiosInstance.post('/auth/logout')
  localStorage.removeItem('token')
}

// Article APIs
export const getArticles = async (params?: {
  page?: number
  limit?: number
  status?: string
  language?: string
  categoryId?: string
}) => {
  const { data } = await axiosInstance.get('/articles', { params })
  return data
}

export const getArticleBySlug = async (slug: string, language: string = 'EN') => {
  const { data } = await axiosInstance.get(`/articles/slug/${slug}`, {
    params: { language },
  })
  return data
}

export const getArticlesByCategory = async (
  categorySlug: string,
  params?: { page?: number; limit?: number; language?: string }
) => {
  const { data } = await axiosInstance.get(`/articles/category/${categorySlug}`, { params })
  return data
}

export const getArticlesByTag = async (
  tagSlug: string,
  params?: { page?: number; limit?: number; language?: string }
) => {
  const { data } = await axiosInstance.get(`/articles/tag/${tagSlug}`, { params })
  return data
}

export const searchArticles = async (query: string, params?: { page?: number; limit?: number; language?: string }) => {
  const { data } = await axiosInstance.get('/articles/search', {
    params: { q: query, ...params },
  })
  return data
}

export const createArticle = async (articleData: any) => {
  const { data } = await axiosInstance.post('/articles', articleData)
  return data
}

export const updateArticle = async (id: string, articleData: any) => {
  const { data } = await axiosInstance.put(`/articles/${id}`, articleData)
  return data
}

export const deleteArticle = async (id: string) => {
  const { data } = await axiosInstance.delete(`/articles/${id}`)
  return data
}

export const submitArticleForReview = async (id: string) => {
  const { data } = await axiosInstance.post(`/articles/${id}/submit`)
  return data
}

export const publishArticle = async (id: string) => {
  const { data } = await axiosInstance.post(`/articles/${id}/publish`)
  return data
}

// Category APIs
export const getCategories = async () => {
  const { data } = await axiosInstance.get('/categories')
  return data
}

export const createCategory = async (categoryData: any) => {
  const { data } = await axiosInstance.post('/categories', categoryData)
  return data
}

export const updateCategory = async (id: string, categoryData: any) => {
  const { data } = await axiosInstance.put(`/categories/${id}`, categoryData)
  return data
}

export const deleteCategory = async (id: string) => {
  const { data } = await axiosInstance.delete(`/categories/${id}`)
  return data
}

// Tag APIs
export const getTags = async () => {
  const { data } = await axiosInstance.get('/tags')
  return data
}

export const createTag = async (tagData: any) => {
  const { data } = await axiosInstance.post('/tags', tagData)
  return data
}

export const updateTag = async (id: string, tagData: any) => {
  const { data } = await axiosInstance.put(`/tags/${id}`, tagData)
  return data
}

export const deleteTag = async (id: string) => {
  const { data } = await axiosInstance.delete(`/tags/${id}`)
  return data
}

// Comment APIs
export const getCommentsByArticle = async (articleId: string, params?: { page?: number; limit?: number }) => {
  const { data } = await axiosInstance.get(`/comments/article/${articleId}`, { params })
  return data
}

export const createComment = async (commentData: any) => {
  const { data } = await axiosInstance.post('/comments', commentData)
  return data
}

export const updateComment = async (id: string, commentData: any) => {
  const { data } = await axiosInstance.put(`/comments/${id}`, commentData)
  return data
}

export const deleteComment = async (id: string) => {
  const { data } = await axiosInstance.delete(`/comments/${id}`)
  return data
}

export const approveComment = async (id: string) => {
  const { data } = await axiosInstance.put(`/comments/${id}/approve`)
  return data
}

// Review APIs
export const getReviews = async (params?: { status?: string; page?: number; limit?: number }) => {
  const { data } = await axiosInstance.get('/reviews', { params })
  return data
}

export const getReviewsByArticle = async (articleId: string) => {
  const { data } = await axiosInstance.get(`/reviews/article/${articleId}`)
  return data
}

export const createReview = async (reviewData: any) => {
  const { data } = await axiosInstance.post('/reviews', reviewData)
  return data
}

export const updateReview = async (id: string, reviewData: any) => {
  const { data } = await axiosInstance.put(`/reviews/${id}`, reviewData)
  return data
}

// User APIs
export const getUsers = async (params?: { page?: number; limit?: number; role?: string; isActive?: boolean }) => {
  const { data } = await axiosInstance.get('/users', { params })
  return data
}

export const getUserById = async (id: string) => {
  const { data } = await axiosInstance.get(`/users/${id}`)
  return data
}

export const updateUser = async (id: string, userData: any) => {
  const { data } = await axiosInstance.put(`/users/${id}`, userData)
  return data
}

export const updateUserRole = async (id: string, roleId: string) => {
  const { data } = await axiosInstance.put(`/users/${id}/role`, { roleId })
  return data
}

export const updateUserStatus = async (id: string, isActive: boolean) => {
  const { data } = await axiosInstance.put(`/users/${id}/status`, { isActive })
  return data
}

// Media APIs
export const uploadImage = async (file: File, articleId?: string, altText?: string) => {
  const formData = new FormData()
  formData.append('image', file)
  if (articleId) formData.append('articleId', articleId)
  if (altText) formData.append('altText', altText)

  const { data } = await axiosInstance.post('/media/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

export const getMedia = async (params?: { page?: number; limit?: number; articleId?: string }) => {
  const { data } = await axiosInstance.get('/media', { params })
  return data
}

export const deleteMedia = async (id: string) => {
  const { data } = await axiosInstance.delete(`/media/${id}`)
  return data
}

// Article workflow APIs
export const approveArticle = async (id: string) => {
  const { data } = await axiosInstance.post(`/articles/${id}/approve`)
  return data
}

export const rejectArticle = async (id: string, feedback: string) => {
  const { data } = await axiosInstance.post(`/articles/${id}/reject`, { feedback })
  return data
}

export const deleteUser = async (id: string) => {
  const { data } = await axiosInstance.delete(`/users/${id}`)
  return data
}

export default axiosInstance
