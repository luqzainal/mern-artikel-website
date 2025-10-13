import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Card, CardBody, CardFooter, Image, Chip, Spinner, Pagination } from '@nextui-org/react'
import { FiClock, FiUser, FiEye, FiArrowLeft } from 'react-icons/fi'
import { getArticles, getCategories } from '../services/api'
import { useLanguage } from '../components/common/LanguageToggle'

export default function Category() {
  const { slug } = useParams()
  const { language } = useLanguage()
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 12

  // Get category details
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const category = categories?.find((cat: any) => cat.slug === slug)

  // Get articles for this category
  const { data: articlesData, isLoading } = useQuery({
    queryKey: ['category-articles', slug, language, currentPage],
    queryFn: () =>
      getArticles({
        language,
        categoryId: category?.id,
        status: 'PUBLISHED',
        page: currentPage,
        limit: articlesPerPage,
      }),
    enabled: !!category?.id,
  })

  if (isLoading || !category) {
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
      {/* Back Button */}
      <Link
        to="/categories"
        className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline mb-6"
      >
        <FiArrowLeft />
        <span>{language === 'EN' ? 'Back to Categories' : 'Kembali ke Kategori'}</span>
      </Link>

      {/* Category Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {language === 'EN' ? category.nameEn : category.nameMy}
        </h1>
        {category.description && (
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
            {category.description}
          </p>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          {articles.length}{' '}
          {language === 'EN'
            ? articles.length === 1
              ? 'article found'
              : 'articles found'
            : articles.length === 1
            ? 'artikel dijumpai'
            : 'artikel dijumpai'}
        </p>
      </div>

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {language === 'EN' ? 'No articles found in this category' : 'Tiada artikel dalam kategori ini'}
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
                        {language === 'EN' ? category.nameEn : category.nameMy}
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
