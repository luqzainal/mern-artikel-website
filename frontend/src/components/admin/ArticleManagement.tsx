import { useState } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
  Select,
  SelectItem,
  Pagination,
  Spinner,
} from '@nextui-org/react'
import { FiPlus, FiEdit, FiTrash2, FiMoreVertical, FiSearch, FiEye, FiSend } from 'react-icons/fi'
import { useLanguage } from '../common/LanguageToggle'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getArticles, deleteArticle, submitArticleForReview, publishArticle } from '../../services/api'
import { useNavigate } from 'react-router-dom'

const statusColorMap: Record<string, "default" | "primary" | "secondary" | "success" | "warning" | "danger"> = {
  DRAFT: 'default',
  PENDING_REVIEW: 'warning',
  IN_REVIEW: 'primary',
  APPROVED: 'success',
  PUBLISHED: 'success',
  REJECTED: 'danger',
  ARCHIVED: 'default',
}

export default function ArticleManagement() {
  const { language } = useLanguage()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const limit = 10

  // Fetch articles from API
  const { data: articlesData, isLoading } = useQuery({
    queryKey: ['admin-articles', language, statusFilter, searchQuery, page],
    queryFn: () => getArticles({
      language,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      page,
      limit,
    } as any),
  })

  const articles = articlesData?.articles || []
  const totalPages = articlesData?.totalPages || 1

  // Delete article mutation
  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
    },
  })

  // Submit for review mutation
  const submitReviewMutation = useMutation({
    mutationFn: submitArticleForReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
    },
  })

  // Publish article mutation
  const publishMutation = useMutation({
    mutationFn: publishArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
    },
  })

  const handleCreateArticle = () => {
    window.open('http://localhost:3002/articles/new', '_blank')
  }

  const handleEditArticle = (id: string) => {
    window.open(`http://localhost:3002/articles/edit/${id}`, '_blank')
  }

  const handleDeleteArticle = (id: string) => {
    if (confirm(language === 'EN' ? 'Are you sure you want to delete this article?' : 'Adakah anda pasti untuk memadam artikel ini?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleSubmitForReview = (id: string) => {
    submitReviewMutation.mutate(id)
  }

  const handlePublish = (id: string) => {
    if (confirm(language === 'EN' ? 'Are you sure you want to publish this article?' : 'Adakah anda pasti untuk menerbitkan artikel ini?')) {
      publishMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === 'EN' ? 'Article Management' : 'Pengurusan Artikel'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {language === 'EN'
              ? 'Create, edit, and manage your articles'
              : 'Cipta, edit, dan urus artikel anda'}
          </p>
        </div>
        <Button
          color="primary"
          startContent={<FiPlus />}
          onClick={handleCreateArticle}
        >
          {language === 'EN' ? 'Create Article' : 'Cipta Artikel'}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              className="md:w-96"
              placeholder={language === 'EN' ? 'Search articles...' : 'Cari artikel...'}
              startContent={<FiSearch />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select
              label={language === 'EN' ? 'Status' : 'Status'}
              placeholder={language === 'EN' ? 'All statuses' : 'Semua status'}
              className="md:w-48"
              selectedKeys={statusFilter === 'all' ? [] : [statusFilter]}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <SelectItem key="DRAFT" value="DRAFT">Draft</SelectItem>
              <SelectItem key="PENDING_REVIEW" value="PENDING_REVIEW">Pending Review</SelectItem>
              <SelectItem key="IN_REVIEW" value="IN_REVIEW">In Review</SelectItem>
              <SelectItem key="APPROVED" value="APPROVED">Approved</SelectItem>
              <SelectItem key="PUBLISHED" value="PUBLISHED">Published</SelectItem>
              <SelectItem key="REJECTED" value="REJECTED">Rejected</SelectItem>
              <SelectItem key="ARCHIVED" value="ARCHIVED">Archived</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Articles Table */}
      <Card>
        <CardHeader className="pb-0 pt-6 px-6">
          <h3 className="text-lg font-semibold">
            {language === 'EN' ? 'Articles' : 'Artikel'}
          </h3>
        </CardHeader>
        <CardBody className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" color="primary" />
            </div>
          ) : (
            <Table aria-label="Articles table">
              <TableHeader>
                <TableColumn>{language === 'EN' ? 'TITLE' : 'TAJUK'}</TableColumn>
                <TableColumn>{language === 'EN' ? 'CATEGORY' : 'KATEGORI'}</TableColumn>
                <TableColumn>{language === 'EN' ? 'AUTHOR' : 'PENULIS'}</TableColumn>
                <TableColumn>{language === 'EN' ? 'STATUS' : 'STATUS'}</TableColumn>
                <TableColumn>{language === 'EN' ? 'VIEWS' : 'TONTONAN'}</TableColumn>
                <TableColumn>{language === 'EN' ? 'CREATED' : 'DICIPTA'}</TableColumn>
                <TableColumn>{language === 'EN' ? 'ACTIONS' : 'TINDAKAN'}</TableColumn>
              </TableHeader>
              <TableBody emptyContent={language === 'EN' ? 'No articles found' : 'Tiada artikel dijumpai'}>
                {articles.map((article: any) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {article.translations?.find((t: any) => t.language === language)?.title || 'Untitled'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {language === 'EN' ? article.category?.nameEn : article.category?.nameMy}
                  </TableCell>
                  <TableCell>{article.author?.name}</TableCell>
                  <TableCell>
                    <Chip color={statusColorMap[article.status]} size="sm" variant="flat">
                      {article.status.replace('_', ' ')}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <FiEye size={14} />
                      {article.viewCount || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(article.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light">
                          <FiMoreVertical />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Article actions">
                        <DropdownItem
                          key="edit"
                          startContent={<FiEdit />}
                          onClick={() => handleEditArticle(article.id)}
                        >
                          {language === 'EN' ? 'Edit' : 'Edit'}
                        </DropdownItem>
                        {article.status === 'DRAFT' ? (
                          <DropdownItem
                            key="submit"
                            startContent={<FiSend />}
                            onClick={() => handleSubmitForReview(article.id)}
                          >
                            {language === 'EN' ? 'Submit for Review' : 'Hantar untuk Semakan'}
                          </DropdownItem>
                        ) : null}
                        {article.status === 'APPROVED' ? (
                          <DropdownItem
                            key="publish"
                            startContent={<FiEye />}
                            onClick={() => handlePublish(article.id)}
                          >
                            {language === 'EN' ? 'Publish' : 'Terbitkan'}
                          </DropdownItem>
                        ) : null}
                        <DropdownItem
                          key="delete"
                          className="text-danger"
                          color="danger"
                          startContent={<FiTrash2 />}
                          onClick={() => handleDeleteArticle(article.id)}
                        >
                          {language === 'EN' ? 'Delete' : 'Padam'}
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination
                total={totalPages}
                page={page}
                onChange={setPage}
                color="primary"
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
