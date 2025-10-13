import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Card, CardBody, CardFooter, Image, Chip, Spinner } from '@nextui-org/react'
import { FiClock, FiUser, FiEye, FiArrowRight } from 'react-icons/fi'
import { getArticles, getCategories } from '../services/api'
import { useLanguage } from '../components/common/LanguageToggle'
import HeroFeatured from '../components/HeroFeatured'
import CategoryGrid from '../components/CategoryGrid'
import { useState } from 'react'

export default function Home() {
  const { language } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  // Fetch featured articles for hero section
  const { data: featuredArticlesData, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-articles', language],
    queryFn: () =>
      getArticles({
        language,
        status: 'PUBLISHED',
        limit: 3, // Get top 3 for featured carousel
      }),
  })

  // Fetch recent articles (6 articles)
  const { data: articlesData, isLoading: articlesLoading } = useQuery({
    queryKey: ['articles', language, selectedCategory],
    queryFn: () =>
      getArticles({
        language,
        categoryId: selectedCategory || undefined,
        status: 'PUBLISHED',
        limit: 6, // Changed from 12 to 6
      }),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  if (articlesLoading || featuredLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" color="primary" />
      </div>
    )
  }

  const articles = articlesData?.data || []
  const featuredArticles = featuredArticlesData?.data || []

  return (
    <div className="container-custom py-8">
      {/* Hero Featured Article Section */}
      {featuredArticles.length > 0 && <HeroFeatured articles={featuredArticles} />}

      {/* Category Grid Section */}
      {categories && categories.length > 0 && <CategoryGrid categories={categories} />}

      {/* Recent Blog Posts Section */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-2">
          {language === 'EN' ? 'Recent Blog Posts' : 'Artikel Terkini'}
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          {language === 'EN'
            ? 'Discover our latest Islamic articles and insights'
            : 'Temui artikel dan pandangan Islam terkini kami'}
        </p>
      </div>

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {language === 'EN' ? 'No articles found' : 'Tiada artikel dijumpai'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: any) => {
            const translation = article.translations[0]
            return (
              <Card
                key={article.id}
                isPressable
                as={Link}
                to={`/article/${article.slug}`}
                className="card-hover"
              >
                {article.featuredImage && (
                  <Image
                    src={article.featuredImage}
                    alt={translation?.title || ''}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardBody className="p-4">
                  <div className="flex gap-2 mb-2">
                    <Chip size="sm" variant="flat" color="primary">
                      {language === 'EN' ? article.category.nameEn : article.category.nameMy}
                    </Chip>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2 text-gray-900 dark:text-white">
                    {translation?.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                    {translation?.excerpt}
                  </p>
                </CardBody>
                <CardFooter className="p-4 pt-0 flex-col items-start gap-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <FiUser size={14} />
                    <span>{article.author.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <FiClock size={14} />
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiEye size={14} />
                      <span>{article.viewCount}</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      {/* View All Articles Button - Enhanced */}
      <div className="flex justify-center mt-16 mb-8">
        <Link to="/articles">
          <button className="group relative px-10 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3">
            <span>{language === 'EN' ? 'View All Articles' : 'Lihat Semua Artikel'}</span>
            <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-xl bg-primary-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity"></div>
          </button>
        </Link>
      </div>
    </div>
  )
}
