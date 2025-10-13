import { useQuery } from '@tanstack/react-query'
import { Spinner, Card, CardBody } from '@nextui-org/react'
import { FiTarget, FiEye, FiHeart } from 'react-icons/fi'
import { useLanguage } from '../components/common/LanguageToggle'
import api from '../services/api'

export default function About() {
  const { language } = useLanguage()

  const { data: aboutData, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: async () => {
      const response = await api.get('/api/about')
      return response.data
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" color="primary" />
      </div>
    )
  }

  const values = language === 'EN' ? aboutData?.valuesEn : aboutData?.valuesMy

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {language === 'EN' ? aboutData?.titleEn : aboutData?.titleMy}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          {language === 'EN' ? aboutData?.descriptionEn : aboutData?.descriptionMy}
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Mission */}
        {(aboutData?.missionEn || aboutData?.missionMy) && (
          <Card className="border-2 border-primary-200 dark:border-primary-800">
            <CardBody className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-xl">
                  <FiTarget className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {language === 'EN' ? 'Our Mission' : 'Misi Kami'}
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {language === 'EN' ? aboutData?.missionEn : aboutData?.missionMy}
              </p>
            </CardBody>
          </Card>
        )}

        {/* Vision */}
        {(aboutData?.visionEn || aboutData?.visionMy) && (
          <Card className="border-2 border-secondary-200 dark:border-secondary-800">
            <CardBody className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-secondary-100 dark:bg-secondary-900 rounded-xl">
                  <FiEye className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {language === 'EN' ? 'Our Vision' : 'Visi Kami'}
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {language === 'EN' ? aboutData?.visionEn : aboutData?.visionMy}
              </p>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Values */}
      {values && Array.isArray(values) && values.length > 0 && (
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {language === 'EN' ? 'Our Values' : 'Nilai-nilai Kami'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'EN'
                ? 'The principles that guide everything we do'
                : 'Prinsip yang membimbing segala yang kami lakukan'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value: string, index: number) => (
              <Card key={index} className="card-hover">
                <CardBody className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <FiHeart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {value}
                  </h3>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

