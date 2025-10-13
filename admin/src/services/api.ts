import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with cross-origin requests
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface ArticleFormData {
  categoryId: string
  tagIds: string[]
  status: string
  featuredImageUrl?: string
  translations: {
    language: 'EN' | 'MY'
    title: string
    content: string
    excerpt: string
    metaTitle?: string
    metaDescription?: string
  }[]
}

export const getArticles = async (params: any) => {
  const { data } = await api.get('/api/articles', { params })
  return data
}

export const getArticle = async (id: string) => {
  const { data } = await api.get(`/api/articles/${id}`)
  return data
}

export const createArticle = async (articleData: ArticleFormData) => {
  const { data } = await api.post('/api/articles', articleData)
  return data
}

export const updateArticle = async (id: string, articleData: ArticleFormData) => {
  const { data } = await api.put(`/api/articles/${id}`, articleData)
  return data
}

export const deleteArticle = async (id: string) => {
  const { data } = await api.delete(`/api/articles/${id}`)
  return data
}

export const getCategories = async () => {
  const { data } = await api.get('/api/categories')
  return data
}

export const getTags = async () => {
  const { data } = await api.get('/api/tags')
  return data
}

export const login = async (email: string, password: string) => {
  const { data } = await api.post('/api/auth/login', { email, password })
  if (data.token) {
    localStorage.setItem('token', data.token)
  }
  return data
}
