import { useState } from 'react'
import { Card, CardBody, Button, Input, Textarea } from '@nextui-org/react'
import { FiMail, FiUser, FiMessageSquare, FiSend } from 'react-icons/fi'
import { useLanguage } from '../components/common/LanguageToggle'
import api from '../services/api'

export default function Contact() {
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      await api.post('/api/contact/submit', formData)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error: any) {
      setSubmitStatus('error')
      setErrorMessage(
        error.response?.data?.error || 'Failed to submit contact form. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container-custom py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'EN' ? 'Contact Us' : 'Hubungi Kami'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {language === 'EN'
              ? 'Have a question or feedback? We\'d love to hear from you.'
              : 'Ada pertanyaan atau maklum balas? Kami ingin mendengar daripada anda.'}
          </p>
        </div>

        <Card className="shadow-xl">
          <CardBody className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <Input
                label={language === 'EN' ? 'Name' : 'Nama'}
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={language === 'EN' ? 'Your name' : 'Nama anda'}
                startContent={<FiUser className="text-gray-400" />}
                isRequired
                variant="bordered"
                size="lg"
              />

              {/* Email Field */}
              <Input
                label={language === 'EN' ? 'Email' : 'E-mel'}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={language === 'EN' ? 'your@email.com' : 'emel@anda.com'}
                startContent={<FiMail className="text-gray-400" />}
                isRequired
                variant="bordered"
                size="lg"
              />

              {/* Subject Field */}
              <Input
                label={language === 'EN' ? 'Subject' : 'Subjek'}
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder={language === 'EN' ? 'What is this about?' : 'Tentang apa ini?'}
                startContent={<FiMessageSquare className="text-gray-400" />}
                variant="bordered"
                size="lg"
              />

              {/* Message Field */}
              <Textarea
                label={language === 'EN' ? 'Message' : 'Mesej'}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={language === 'EN' ? 'Your message...' : 'Mesej anda...'}
                minRows={6}
                isRequired
                variant="bordered"
              />

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 rounded-lg">
                  <p className="text-green-800 dark:text-green-200 font-medium">
                    {language === 'EN'
                      ? '✓ Thank you! Your message has been sent successfully.'
                      : '✓ Terima kasih! Mesej anda telah berjaya dihantar.'}
                  </p>
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 rounded-lg">
                  <p className="text-red-800 dark:text-red-200 font-medium">
                    ✗ {errorMessage}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                color="primary"
                size="lg"
                className="w-full font-semibold"
                isLoading={isSubmitting}
                startContent={!isSubmitting && <FiSend />}
              >
                {isSubmitting
                  ? language === 'EN'
                    ? 'Sending...'
                    : 'Menghantar...'
                  : language === 'EN'
                  ? 'Send Message'
                  : 'Hantar Mesej'}
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            {language === 'EN'
              ? 'We typically respond within 24-48 hours.'
              : 'Kami biasanya akan membalas dalam tempoh 24-48 jam.'}
          </p>
        </div>
      </div>
    </div>
  )
}

