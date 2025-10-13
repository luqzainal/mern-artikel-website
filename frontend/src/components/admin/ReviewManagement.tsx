import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Spinner, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react'
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'
import { useLanguage } from '../common/LanguageToggle'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getArticles, approveArticle, rejectArticle } from '../../services/api'
import { useState } from 'react'

const statusColorMap: Record<string, "default" | "primary" | "secondary" | "success" | "warning" | "danger"> = {
  PENDING_REVIEW: 'warning',
  IN_REVIEW: 'primary',
}

export default function ReviewManagement() {
  const { language } = useLanguage()
  const queryClient = useQueryClient()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedArticle, setSelectedArticle] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  // Fetch articles pending review
  const { data: articlesData, isLoading } = useQuery({
    queryKey: ['review-articles', language],
    queryFn: () => getArticles({
      language,
      status: 'PENDING_REVIEW,IN_REVIEW',
      limit: 50,
    }),
  })

  const articles = articlesData?.articles || []

  // Approve article mutation
  const approveMutation = useMutation({
    mutationFn: (id: string) => approveArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review-articles'] })
    },
  })

  // Reject article mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, feedback }: { id: string; feedback: string }) =>
      rejectArticle(id, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review-articles'] })
      onClose()
      setRejectionReason('')
    },
  })

  const handleApprove = (articleId: string) => {
    if (confirm(language === 'EN' ? 'Approve this article?' : 'Luluskan artikel ini?')) {
      approveMutation.mutate(articleId)
    }
  }

  const handleRejectClick = (article: any) => {
    setSelectedArticle(article)
    onOpen()
  }

  const handleRejectSubmit = () => {
    if (!rejectionReason.trim()) {
      alert(language === 'EN' ? 'Please provide a reason for rejection' : 'Sila berikan sebab penolakan')
      return
    }
    rejectMutation.mutate({ id: selectedArticle.id, feedback: rejectionReason })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{language === 'EN' ? 'Review Management' : 'Pengurusan Semakan'}</h2>
      <Card>
        <CardHeader className="pb-0 pt-6 px-6">
          <h3 className="text-lg font-semibold">{language === 'EN' ? 'Pending Reviews' : 'Semakan Tertangguh'}</h3>
        </CardHeader>
        <CardBody className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" color="primary" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {language === 'EN' ? 'No pending reviews' : 'Tiada semakan tertangguh'}
            </div>
          ) : (
            <Table aria-label="Review table">
              <TableHeader>
                <TableColumn>{language === 'EN' ? 'TITLE' : 'TAJUK'}</TableColumn>
                <TableColumn>{language === 'EN' ? 'AUTHOR' : 'PENULIS'}</TableColumn>
                <TableColumn>{language === 'EN' ? 'CATEGORY' : 'KATEGORI'}</TableColumn>
                <TableColumn>{language === 'EN' ? 'STATUS' : 'STATUS'}</TableColumn>
                <TableColumn>{language === 'EN' ? 'SUBMITTED' : 'DIHANTAR'}</TableColumn>
                <TableColumn>{language === 'EN' ? 'ACTIONS' : 'TINDAKAN'}</TableColumn>
              </TableHeader>
              <TableBody>
                {articles.map((article: any) => {
                  const translation = article.translations?.find((t: any) => t.language === language)
                  return (
                    <TableRow key={article.id}>
                      <TableCell>
                        <p className="font-medium">{translation?.title || 'Untitled'}</p>
                      </TableCell>
                      <TableCell>{article.author?.name}</TableCell>
                      <TableCell>
                        {language === 'EN' ? article.category?.nameEn : article.category?.nameMy}
                      </TableCell>
                      <TableCell>
                        <Chip color={statusColorMap[article.status]} size="sm" variant="flat">
                          {article.status.replace('_', ' ')}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        {new Date(article.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            color="success"
                            variant="flat"
                            startContent={<FiCheckCircle />}
                            onClick={() => handleApprove(article.id)}
                            isLoading={approveMutation.isPending}
                          >
                            {language === 'EN' ? 'Approve' : 'Luluskan'}
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            startContent={<FiXCircle />}
                            onClick={() => handleRejectClick(article)}
                            isLoading={rejectMutation.isPending}
                          >
                            {language === 'EN' ? 'Reject' : 'Tolak'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Rejection Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            {language === 'EN' ? 'Reject Article' : 'Tolak Artikel'}
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {language === 'EN'
                ? 'Please provide feedback for the author:'
                : 'Sila berikan maklum balas kepada penulis:'}
            </p>
            <Textarea
              placeholder={language === 'EN' ? 'Reason for rejection...' : 'Sebab penolakan...'}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              minRows={4}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              {language === 'EN' ? 'Cancel' : 'Batal'}
            </Button>
            <Button
              color="danger"
              onPress={handleRejectSubmit}
              isLoading={rejectMutation.isPending}
            >
              {language === 'EN' ? 'Reject Article' : 'Tolak Artikel'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
