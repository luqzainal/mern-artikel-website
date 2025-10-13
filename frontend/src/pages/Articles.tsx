import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Card, CardBody, CardFooter, Image, Chip, Button, Spinner, Pagination } from '@nextui-org/react'
import { FiClock, FiUser, FiEye } from 'react-icons/fi'
import { getArticles, getCategories } from '../services/api'
import { useLanguage } from '../components/common/LanguageToggle'

export default function Articles() {
  const { language } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 12

  const { data: articlesData, isLoading: articlesLoading } = useQuery({
    queryKey: ['all-articles', language, selectedCategory, currentPage],
    queryFn: () =>
      getArticles({
        language,
        categoryId: selectedCategory || undefined,
        status: 'PUBLISHED',
        page: currentPage,
        limit: articlesPerPage,
      }),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  if (articlesLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" color="primary" />
      </div>
    )
  }

  const articles = articlesData?.data || []
  const totalPages = articlesData?.pagination?.totalPages || 1

  return (
    <div className="container-custom py-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {language === 'EN' ? 'All Articles' : 'Semua Artikel'}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {language === 'EN'
            ? 'Browse our complete collection of Islamic articles'
            : 'Layari koleksi lengkap artikel Islam kami'}
        </p>
      </div>

      {/* Category Filter */}
      {categories && categories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {language === 'EN' ? 'Filter by Category' : 'Tapis mengikut Kategori'}
          </h2>
          <div className="flex flex-wrap gap-2">
            <Chip
              variant={selectedCategory === '' ? 'solid' : 'bordered'}
              color="primary"
              className="cursor-pointer"
              onClick={() => {
                setSelectedCategory('')
                setCurrentPage(1)
              }}
            >
              {language === 'EN' ? 'All' : 'Semua'}
            </Chip>
            {categories.map((category: any) => (
              <Chip
                key={category.id}
                variant={selectedCategory === category.id ? 'solid' : 'bordered'}
                color="primary"
                className="cursor-pointer"
                onClick={() => {
                  setSelectedCategory(category.id)
                  setCurrentPage(1)
                }}
              >
                {language === 'EN' ? category.nameEn : category.nameMy}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {/* Articles Count */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'EN' ? 'Showing' : 'Menunjukkan'}{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {articles.length}
          </span>{' '}
          {language === 'EN' ? 'articles' : 'artikel'}
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={setCurrentPage}
                color="primary"
                showControls
                showShadow
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

