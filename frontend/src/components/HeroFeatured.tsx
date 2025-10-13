import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Chip } from '@nextui-org/react'
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import { useLanguage } from './common/LanguageToggle'

interface FeaturedArticle {
  id: string
  slug: string
  featuredImage: string | null
  category: {
    nameEn: string
    nameMy: string
  }
  translations: {
    title: string
    excerpt: string
  }[]
}

interface HeroFeaturedProps {
  articles: FeaturedArticle[]
}

export default function HeroFeatured({ articles }: HeroFeaturedProps) {
  const { language } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (articles.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [articles.length])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length)
  }

  if (!articles || articles.length === 0) return null

  const currentArticle = articles[currentIndex]
  const translation = currentArticle.translations[0]

  return (
    <div className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden mb-12 group">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: currentArticle.featuredImage
            ? `url(${currentArticle.featuredImage})`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 lg:p-16">
        <div className="max-w-3xl">
          {/* Category Badge */}
          <Chip size="sm" variant="solid" color="primary" className="mb-4">
            Featured
          </Chip>

          {/* Title */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {translation?.title}
          </h2>

          {/* Excerpt */}
          <p className="text-base md:text-lg text-gray-200 mb-6 line-clamp-2 max-w-2xl">
            {translation?.excerpt}
          </p>

          {/* Read More Button */}
          <Button
            as={Link}
            to={`/article/${currentArticle.slug}`}
            color="primary"
            size="lg"
            endContent={<FiArrowRight />}
            className="font-semibold"
          >
            {language === 'EN' ? 'Read Article' : 'Baca Artikel'}
          </Button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {articles.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous"
          >
            <FiArrowLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next"
          >
            <FiArrowRight size={24} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {articles.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

