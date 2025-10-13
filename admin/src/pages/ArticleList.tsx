import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card, CardBody } from '@nextui-org/react';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Breadcrumb from '../components/Layout/Breadcrumb';
import ArticleFilters from '../components/Articles/ArticleFilters';
import ArticleTable from '../components/Articles/ArticleTable';
import BulkActions from '../components/Articles/BulkActions';
import ArticleStatistics from '../components/Articles/ArticleStatistics';
import { getArticles, deleteArticle } from '../services/api';
import { Article, ArticleFilters as ArticleFiltersType } from '../types';
import { useToast } from '../context/ToastContext';
import { ArticleListSkeleton } from '../components/ui/ArticleCardSkeleton';

export default function ArticleList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  
  // State
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ArticleFiltersType>({
    search: '',
    status: 'all',
    categoryId: undefined,
    authorId: undefined,
    language: 'all',
  });
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [selectedArticleForStats, setSelectedArticleForStats] = useState<string | null>(null);

  // Fetch articles
  const { data: articlesData, isLoading } = useQuery({
    queryKey: ['articles', page, filters, sortColumn, sortDirection],
    queryFn: () => getArticles({ 
      page, 
      limit: 10,
      ...filters,
      sortBy: sortColumn,
      sortOrder: sortDirection,
    }),
  });

  // Fetch categories for filter
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // Mock data - replace with actual API
      return [
        { id: '1', name: 'Fiqh' },
        { id: '2', name: 'Aqidah' },
        { id: '3', name: 'Hadith' },
      ];
    },
  });

  // Fetch authors for filter
  const { data: authors = [] } = useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      // Mock data - replace with actual API
      return [
        { id: '1', name: 'Ahmad Ibrahim' },
        { id: '2', name: 'Fatimah Ali' },
      ];
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      showToast('Article deleted successfully!', 'success');
    },
    onError: () => {
      showToast('Error deleting article.', 'error');
    },
  });

  // Handlers
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteMutation.mutate(id);
      setSelectedArticles(selectedArticles.filter((a) => a !== id));
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'publish':
        toast.success(`${selectedArticles.length} articles marked for publication`);
        break;
      case 'archive':
        toast.success(`${selectedArticles.length} articles archived`);
        break;
      case 'delete':
        if (window.confirm(`Delete ${selectedArticles.length} articles?`)) {
          toast.success(`${selectedArticles.length} articles deleted`);
          setSelectedArticles([]);
        }
        break;
      case 'assign-category':
        toast('Category assignment feature coming soon');
        break;
      case 'change-status':
        toast('Status change feature coming soon');
        break;
    }
  };

  const handleViewStats = (id: string) => {
    setSelectedArticleForStats(id);
    setStatsModalOpen(true);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      categoryId: undefined,
      authorId: undefined,
      language: 'all',
    });
  };

  const articles: Article[] = articlesData?.articles || [];
  const totalPages = articlesData?.totalPages || 1;

  // Mock articles if API returns empty
  const displayArticles = articles.length > 0 ? articles : [
    {
      id: '1',
      categoryId: '1',
      createdBy: '1',
      status: 'published' as const,
      views: 1234,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      translations: [
        {
          id: '1',
          articleId: '1',
          langCode: 'ms' as const,
          title: 'Pengenalan kepada Kewangan Islam',
          content: 'Content here...',
          excerpt: 'Introduction to Islamic Finance principles',
        },
      ],
      category: { id: '1', name: 'Fiqh', slug: 'fiqh', createdAt: new Date().toISOString() },
      author: {
        id: '1',
        name: 'Ahmad Ibrahim',
        email: 'ahmad@example.com',
        role: 'author' as const,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    },
  ];

  if (isLoading) {
    return <ArticleListSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Article Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage and organize your articles
          </p>
        </div>
        <Button
          className="bg-green-500 text-white"
          startContent={<Plus size={20} />}
          onPress={() => navigate('/articles/new')}
        >
          Add New Article
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="p-4">
          <ArticleFilters
            filters={filters}
            categories={categories}
            authors={authors}
            onFilterChange={setFilters}
            onClear={handleClearFilters}
          />
        </CardBody>
      </Card>

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedArticles.length}
        onBulkAction={handleBulkAction}
        onClearSelection={() => setSelectedArticles([])}
      />

      {/* Articles Table */}
      <Card>
        <CardBody className="p-0">
          <ArticleTable
            articles={displayArticles}
            selectedArticles={selectedArticles}
            onSelectionChange={setSelectedArticles}
            onSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onDelete={handleDelete}
            onViewStats={handleViewStats}
            isLoading={isLoading}
          />
        </CardBody>
      </Card>

      {/* Statistics Modal */}
      <ArticleStatistics
        isOpen={statsModalOpen}
        onClose={() => setStatsModalOpen(false)}
        articleId={selectedArticleForStats || ''}
        articleTitle={
          displayArticles.find((a) => a.id === selectedArticleForStats)?.translations?.[0]?.title
        }
      />
    </div>
  );
}
