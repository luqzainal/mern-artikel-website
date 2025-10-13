import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import Home from './pages/Home'
import Articles from './pages/Articles'
import Categories from './pages/Categories'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import ArticleDetail from './pages/ArticleDetail'
import Category from './pages/Category'
import Tag from './pages/Tag'
import Search from './pages/Search'
import AuthCallback from './pages/AuthCallback'
import ProfileSettings from './pages/ProfileSettings'
import NotFound from './pages/NotFound'

// Admin Redirect Component
function AdminRedirect() {
  useEffect(() => {
    window.open('http://localhost:3002', '_blank')
    window.history.back()
  }, [])

  return <div className="p-8 text-center">Membuka Admin Portal...</div>
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<AdminRedirect />} />
        <Route path="*" element={
          <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/article/:slug" element={<ArticleDetail />} />
                <Route path="/category/:slug" element={<Category />} />
                <Route path="/tag/:slug" element={<Tag />} />
                <Route path="/search" element={<Search />} />
                <Route path="/profile" element={<ProfileSettings />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </AuthProvider>
  )
}

export default App
