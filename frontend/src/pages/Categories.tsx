import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Card, CardBody, Spinner } from '@nextui-org/react'
import { FiBook } from 'react-icons/fi'
import { getCategories } from '../services/api'
import { useLanguage } from '../components/common/LanguageToggle'

export default function Categories() {
  const { language } = useLanguage()

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" color="primary" />
      </div>
    )
  }

  return (
    <div className="container-custom py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {language === 'EN' ? 'Categories' : 'Kategori'}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {language === 'EN'
            ? 'Explore articles organized by Islamic topics and subjects'
            : 'Terokai artikel yang diorganisasi mengikut topik dan subjek Islam'}
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories?.map((category: any) => (
          <Card
            key={category.id}
            isPressable
            as={Link}
            to={`/category/${category.slug}`}
            className="card-hover group"
          >
            <CardBody className="p-8">
              {/* Icon */}
              <div className="mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiBook className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Category Name */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {language === 'EN' ? category.nameEn : category.nameMy}
              </h3>

              {/* Description */}
              {category.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {category.description}
                </p>
              )}

              {/* Article Count */}
              <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium">
                <span className="text-2xl font-bold">{category._count?.articles || 0}</span>
                <span className="text-sm">
                  {language === 'EN' ? 'articles' : 'artikel'}
                </span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {(!categories || categories.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {language === 'EN' ? 'No categories found' : 'Tiada kategori dijumpai'}
          </p>
        </div>
      )}
    </div>
  )
}

