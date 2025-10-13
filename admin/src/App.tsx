import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/Toast';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import { Spinner } from '@nextui-org/react';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Lazy load pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ArticleList = React.lazy(() => import('./pages/ArticleList'));
const ArticleForm = React.lazy(() => import('./pages/ArticleForm'));
const ReviewManagement = React.lazy(() => import('./pages/ReviewManagement'));
const CategoriesManagement = React.lazy(() => import('./pages/CategoriesManagement'));
const MediaLibrary = React.lazy(() => import('./pages/MediaLibrary'));
const UserManagement = React.lazy(() => import('./pages/UserManagement'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const Login = React.lazy(() => import('./pages/Login'));

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <ErrorBoundary>
      <ToastProvider>
        <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>}>
          <Routes>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
              } 
            />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/articles" element={<ArticleList />} />
                      <Route path="/articles/new" element={<ArticleForm />} />
                      <Route path="/articles/edit/:id" element={<ArticleForm />} />
                      <Route path="/reviews" element={<ReviewManagement />} />
                      <Route path="/categories" element={<CategoriesManagement />} />
                      <Route path="/media" element={<MediaLibrary />} />
                      <Route path="/users" element={<UserManagement />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
