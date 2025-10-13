import { Link } from 'react-router-dom'
import { Card, CardBody } from '@nextui-org/react'
import { useLanguage } from './common/LanguageToggle'

interface Category {
  id: string
  slug: string
  nameEn: string
  nameMy: string
  descriptionEn?: string
  descriptionMy?: string
  imageUrl?: string
  _count?: {
    articles: number
  }
}

interface CategoryGridProps {
  categories: Category[]
}

// Default category images (will be used if no image is provided)
const defaultCategoryImages: Record<string, string> = {
  aqidah: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80',
  fiqh: 'https://images.unsplash.com/photo-1584286595398-a59f21d3c1d8?w=800&q=80',
  hadith: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&q=80',
  seerah: 'https://images.unsplash.com/photo-1564769610726-da2890c68f66?w=800&q=80',
  tafsir: 'https://images.unsplash.com/photo-1585522646745-7676fc7c5e17?w=800&q=80',
  contemporary: 'https://images.unsplash.com/photo-1568792923760-d70635a89fdc?w=800&q=80',
  default: 'https://images.unsplash.com/photo-1549570426-e1c5b7d80a2e?w=800&q=80',
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const { language } = useLanguage()

  if (!categories || categories.length === 0) return null

  const getCategoryImage = (category: Category) => {
    if (category.imageUrl) return category.imageUrl
    const slug = category.slug.toLowerCase()
    return defaultCategoryImages[slug] || defaultCategoryImages.default
  }

  return (
    <div className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {language === 'EN' ? 'Explore Categories' : 'Terokai Kategori'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'EN'
            ? 'Discover articles across various Islamic topics'
            : 'Temui artikel merentasi pelbagai topik Islam'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Card
            key={category.id}
            isPressable
            as={Link}
            to={`/category/${category.slug}`}
            className="card-hover overflow-hidden"
          >
            {/* Category Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={getCategoryImage(category)}
                alt={language === 'EN' ? category.nameEn : category.nameMy}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Article Count Badge */}
              {category._count && (
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900 dark:text-white">
                  {category._count.articles} {language === 'EN' ? 'articles' : 'artikel'}
                </div>
              )}
            </div>

            {/* Category Info */}
            <CardBody className="p-5">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {language === 'EN' ? category.nameEn : category.nameMy}
              </h3>
              {(language === 'EN' ? category.descriptionEn : category.descriptionMy) && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {language === 'EN' ? category.descriptionEn : category.descriptionMy}
                </p>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}

