import { Input, Select, SelectItem, Button } from '@nextui-org/react';
import { Search, X } from 'lucide-react';
import { ArticleStatus } from '../../types';
import { ARTICLE_STATUSES, LANGUAGES } from '../../utils/constants';

interface ArticleFiltersProps {
  filters: {
    search?: string;
    status?: ArticleStatus | 'all';
    categoryId?: string;
    authorId?: string;
    language?: 'ms' | 'en' | 'all';
    dateFrom?: string;
    dateTo?: string;
  };
  categories?: Array<{ id: string; name: string }>;
  authors?: Array<{ id: string; name: string }>;
  onFilterChange: (filters: any) => void;
  onClear: () => void;
}

export default function ArticleFilters({
  filters,
  categories = [],
  authors = [],
  onFilterChange,
  onClear,
}: ArticleFiltersProps) {
  const handleChange = (key: string, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value && value !== 'all'
  );

  const statusOptions = [
    { key: 'all', label: 'All Status' },
    ...Object.entries(ARTICLE_STATUSES).map(([key, value]) => ({
      key,
      label: value.label,
    })),
  ];

  const categoryOptions = [
    { id: 'all', name: 'All Categories' },
    ...categories,
  ];

  const authorOptions = [{ id: 'all', name: 'All Authors' }, ...authors];

  const languageOptions = [
    { code: 'all', label: 'All Languages' },
    ...LANGUAGES,
  ];

  return (
    <div className="space-y-4">
      {/* Search */}
      <Input
        placeholder="Search articles by title or content..."
        value={filters.search || ''}
        onChange={(e) => handleChange('search', e.target.value)}
        startContent={<Search size={18} className="text-gray-400" />}
        endContent={
          filters.search && (
            <button
              onClick={() => handleChange('search', '')}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )
        }
        classNames={{
          input: 'text-sm',
        }}
      />

      {/* Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Status Filter */}
        <Select
          label="Status"
          placeholder="All Status"
          selectedKeys={filters.status ? [filters.status] : ['all']}
          onChange={(e) => handleChange('status', e.target.value)}
          items={statusOptions}
          classNames={{
            trigger: 'h-10',
            label: 'text-xs',
          }}
        >
          {(item) => (
            <SelectItem key={item.key} value={item.key}>
              {item.label}
            </SelectItem>
          )}
        </Select>

        {/* Category Filter */}
        <Select
          label="Category"
          placeholder="All Categories"
          selectedKeys={filters.categoryId ? [filters.categoryId] : ['all']}
          onChange={(e) => handleChange('categoryId', e.target.value)}
          items={categoryOptions}
          classNames={{
            trigger: 'h-10',
            label: 'text-xs',
          }}
        >
          {(item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.name}
            </SelectItem>
          )}
        </Select>

        {/* Author Filter */}
        <Select
          label="Author"
          placeholder="All Authors"
          selectedKeys={filters.authorId ? [filters.authorId] : ['all']}
          onChange={(e) => handleChange('authorId', e.target.value)}
          items={authorOptions}
          classNames={{
            trigger: 'h-10',
            label: 'text-xs',
          }}
        >
          {(item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.name}
            </SelectItem>
          )}
        </Select>

        {/* Language Filter */}
        <Select
          label="Language"
          placeholder="All Languages"
          selectedKeys={filters.language ? [filters.language] : ['all']}
          onChange={(e) => handleChange('language', e.target.value)}
          items={languageOptions}
          classNames={{
            trigger: 'h-10',
            label: 'text-xs',
          }}
        >
          {(item) => (
            <SelectItem key={item.code} value={item.code}>
              {item.label}
            </SelectItem>
          )}
        </Select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <Button
              size="sm"
              variant="flat"
              color="danger"
              onPress={onClear}
              startContent={<X size={16} />}
              className="w-full h-10"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

