import { Button, ButtonGroup } from '@nextui-org/react';

export type CommentStatusFilter = 'all' | 'pending' | 'approved' | 'spam';

interface CommentFiltersProps {
  activeFilter: CommentStatusFilter;
  onFilterChange: (filter: CommentStatusFilter) => void;
}

const filters: { key: CommentStatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'spam', label: 'Spam' },
];

const CommentFilters = ({ activeFilter, onFilterChange }: CommentFiltersProps) => {
  return (
    <div className="flex justify-center my-4">
      <ButtonGroup>
        {filters.map((filter) => (
          <Button
            key={filter.key}
            variant={activeFilter === filter.key ? 'solid' : 'flat'}
            color={activeFilter === filter.key ? 'primary' : 'default'}
            onPress={() => onFilterChange(filter.key)}
          >
            {filter.label}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default CommentFilters;
