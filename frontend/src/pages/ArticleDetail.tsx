import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Card, CardBody, Chip, Avatar, Spinner, Tabs, Tab, Divider, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react'
import { FiClock, FiEye, FiTag, FiShare2 } from 'react-icons/fi'
import { FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin, FaTelegram, FaLink } from 'react-icons/fa'
import ReactMarkdown from 'react-markdown'
import { getArticleBySlug } from '../services/api'
import { useLanguage } from '../components/common/LanguageToggle'
import CommentSection from '../components/common/CommentSection'

export default function ArticleDetail() {
  const { slug } = useParams()
  const { language } = useLanguage()

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', slug, language],
    queryFn: () => getArticleBySlug(slug!, language),
    enabled: !!slug,
  })

  const shareArticle = (platform: string) => {
    const url = window.location.href
    const title = article?.translations?.find((t: any) => t.language === language)?.title || 'Islamic Article'

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    }

    if (platform === 'copy') {
      navigator.clipboard.writeText(url)
      alert(language === 'EN' ? 'Link copied to clipboard!' : 'Pautan disalin ke papan klip!')
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" color="primary" />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container-custom py-8">
        <Card>
          <CardBody className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
            <p className="text-gray-600">The article you are looking for does not exist.</p>
          </CardBody>
        </Card>
      </div>
    )
  }

  const translationEN = article.translations.find((t: any) => t.language === 'EN')
  const translationMY = article.translations.find((t: any) => t.language === 'MY')
  const currentTranslation = language === 'EN' ? translationEN : translationMY
  const otherTranslation = language === 'EN' ? translationMY : translationEN

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Featured Image */}
      {article.featuredImage && (
        <div className="w-full h-96 overflow-hidden">
          <img
            src={article.featuredImage}
            alt={currentTranslation?.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <Card className="mb-6">
            <CardBody className="p-8">
              {/* Category */}
              <Chip color="primary" variant="flat" className="mb-4">
                {language === 'EN' ? article.category.nameEn : article.category.nameMy}
              </Chip>

              {/* Title */}
              <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {currentTranslation?.title}
              </h1>

              {/* Meta Info & Share */}
              <div className="flex flex-wrap gap-4 mb-6 text-gray-600 dark:text-gray-400 items-center justify-between">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={article.author.profilePicture}
                      name={article.author.name}
                      size="sm"
                    />
                    <span>{article.author.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiClock size={16} />
                    <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiEye size={16} />
                    <span>{article.viewCount} views</span>
                  </div>
                </div>

                {/* Share Button */}
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      color="primary"
                      variant="flat"
                      startContent={<FiShare2 />}
                      size="sm"
                    >
                      {language === 'EN' ? 'Share' : 'Kongsi'}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Share options">
                    <DropdownItem
                      key="facebook"
                      startContent={<FaFacebook className="text-blue-600" />}
                      onClick={() => shareArticle('facebook')}
                    >
                      Facebook
                    </DropdownItem>
                    <DropdownItem
                      key="twitter"
                      startContent={<FaTwitter className="text-sky-500" />}
                      onClick={() => shareArticle('twitter')}
                    >
                      Twitter
                    </DropdownItem>
                    <DropdownItem
                      key="whatsapp"
                      startContent={<FaWhatsapp className="text-green-600" />}
                      onClick={() => shareArticle('whatsapp')}
                    >
                      WhatsApp
                    </DropdownItem>
                    <DropdownItem
                      key="linkedin"
                      startContent={<FaLinkedin className="text-blue-700" />}
                      onClick={() => shareArticle('linkedin')}
                    >
                      LinkedIn
                    </DropdownItem>
                    <DropdownItem
                      key="telegram"
                      startContent={<FaTelegram className="text-sky-400" />}
                      onClick={() => shareArticle('telegram')}
                    >
                      Telegram
                    </DropdownItem>
                    <DropdownItem
                      key="copy"
                      startContent={<FaLink className="text-gray-600" />}
                      onClick={() => shareArticle('copy')}
                    >
                      {language === 'EN' ? 'Copy Link' : 'Salin Pautan'}
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.map((articleTag: any) => (
                    <Chip
                      key={articleTag.id}
                      size="sm"
                      variant="bordered"
                      startContent={<FiTag size={12} />}
                    >
                      {language === 'EN' ? articleTag.tag.nameEn : articleTag.tag.nameMy}
                    </Chip>
                  ))}
                </div>
              )}

              {/* Excerpt */}
              {currentTranslation?.excerpt && (
                <p className="text-lg text-gray-600 dark:text-gray-400 italic border-l-4 border-primary-500 pl-4 py-2">
                  {currentTranslation.excerpt}
                </p>
              )}
            </CardBody>
          </Card>

          {/* Article Content - Bilingual Tabs */}
          <Card className="mb-6">
            <CardBody className="p-8">
              {translationEN && translationMY ? (
                <Tabs
                  selectedKey={language}
                  onSelectionChange={(_key) => {
                    // This will be handled by LanguageToggle component
                  }}
                  aria-label="Article language"
                  color="primary"
                  variant="underlined"
                  className="mb-6"
                >
                  <Tab key="EN" title="English">
                    <div className="article-content">
                      <ReactMarkdown>{translationEN.content}</ReactMarkdown>
                    </div>
                  </Tab>
                  <Tab key="MY" title="Bahasa Melayu">
                    <div className="article-content">
                      <ReactMarkdown>{translationMY.content}</ReactMarkdown>
                    </div>
                  </Tab>
                </Tabs>
              ) : (
                <div className="article-content">
                  <ReactMarkdown>{currentTranslation?.content}</ReactMarkdown>
                </div>
              )}

              {/* References */}
              {article.references && (
                <>
                  <Divider className="my-8" />
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                      References
                    </h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {Array.isArray(article.references) ? (
                        <ol className="list-decimal list-inside space-y-2">
                          {article.references.map((ref: string, index: number) => (
                            <li key={index}>{ref}</li>
                          ))}
                        </ol>
                      ) : (
                        <p>{article.references}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Translator Info */}
              {otherTranslation?.translator && (
                <>
                  <Divider className="my-8" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>
                      {language === 'EN' ? 'Translated to Malay by' : 'Diterjemah ke Bahasa Inggeris oleh'}{' '}
                      <span className="font-medium">{otherTranslation.translator.name}</span>
                    </p>
                  </div>
                </>
              )}
            </CardBody>
          </Card>

          {/* Comments Section */}
          <CommentSection articleId={article.id} />
        </div>
      </div>
    </div>
  )
}
