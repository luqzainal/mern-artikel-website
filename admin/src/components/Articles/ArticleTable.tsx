import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  User,
  Pagination,
} from '@nextui-org/react';
import { MoreVertical, Edit, Eye, Trash2, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Article } from '../../types';
import ArticleStatusBadge from './ArticleStatusBadge';
import { formatDate, formatNumber } from '../../utils/helpers';

interface ArticleTableProps {
  articles: Article[];
  selectedArticles: string[];
  onSelectionChange: (ids: string[]) => void;
  onSort: (column: string) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => void;
  onViewStats: (id: string) => void;
  isLoading?: boolean;
}

export default function ArticleTable({
  articles,
  selectedArticles,
  onSelectionChange,
  onSort,
  sortColumn,
  sortDirection,
  currentPage,
  totalPages,
  onPageChange,
  onDelete,
  onViewStats,
  isLoading = false,
}: ArticleTableProps) {
  const navigate = useNavigate();

  const handleSelectOne = (id: string, isSelected: boolean) => {
    if (isSelected) {
      onSelectionChange([...selectedArticles, id]);
    } else {
      onSelectionChange(selectedArticles.filter((i) => i !== id));
    }
  };

  const columns = [
    { key: 'title', label: 'TITLE', sortable: true },
    { key: 'author', label: 'AUTHOR', sortable: true },
    { key: 'category', label: 'CATEGORY', sortable: true },
    { key: 'status', label: 'STATUS', sortable: true },
    { key: 'views', label: 'VIEWS', sortable: true },
    { key: 'createdAt', label: 'CREATED', sortable: true },
    { key: 'actions', label: 'ACTIONS', sortable: false },
  ];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded-lg animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          No articles found
        </p>
        <Button
          className="bg-green-500 text-white"
          onPress={() => navigate('/articles/new')}
        >
          Add New Article
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table
        aria-label="Articles table"
        selectionMode="multiple"
        selectedKeys={new Set(selectedArticles)}
        classNames={{
          wrapper: 'shadow-none border border-gray-200 dark:border-gray-700',
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              className={column.sortable ? 'cursor-pointer' : ''}
              onClick={() => column.sortable && onSort(column.key)}
            >
              <div className="flex items-center gap-1">
                {column.label}
                {column.sortable && sortColumn === column.key && (
                  <span className="text-xs">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </TableColumn>
          )}
        </TableHeader>
        <TableBody>
          {articles.map((article) => {
            const translation = article.translations?.[0];
            return (
              <TableRow key={article.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      isSelected={selectedArticles.includes(article.id)}
                      onValueChange={(isSelected) =>
                        handleSelectOne(article.id, isSelected)
                      }
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {translation?.title || 'Untitled'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {translation?.excerpt || 'No excerpt'}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <User
                    name={article.author?.name || 'Unknown'}
                    description={article.author?.role}
                    avatarProps={{
                      src: article.author?.profilePicture,
                      size: 'sm',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {article.category?.name || '-'}
                  </span>
                </TableCell>
                <TableCell>
                  <ArticleStatusBadge status={article.status} />
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {formatNumber(article.views)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(article.createdAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                      >
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Article Actions">
                      <DropdownItem
                        key="edit"
                        startContent={<Edit size={16} />}
                        onPress={() => navigate(`/articles/edit/${article.id}`)}
                      >
                        Edit
                      </DropdownItem>
                      <DropdownItem
                        key="preview"
                        startContent={<Eye size={16} />}
                        onPress={() => window.open(`/preview/${article.id}`, '_blank')}
                      >
                        Preview
                      </DropdownItem>
                      <DropdownItem
                        key="stats"
                        startContent={<BarChart3 size={16} />}
                        onPress={() => onViewStats(article.id)}
                      >
                        View Statistics
                      </DropdownItem>
                      <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                        startContent={<Trash2 size={16} />}
                        onPress={() => onDelete(article.id)}
                      >
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={onPageChange}
            showControls
            classNames={{
              cursor: 'bg-primary-600 text-white',
            }}
          />
        </div>
      )}
    </div>
  );
}

