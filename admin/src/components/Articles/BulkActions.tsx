import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { CheckSquare, Archive, Trash2, Tag, Globe } from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  onBulkAction: (action: string) => void;
  onClearSelection: () => void;
}

export default function BulkActions({
  selectedCount,
  onBulkAction,
  onClearSelection,
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-primary-900 dark:text-primary-100">
          {selectedCount} article{selectedCount > 1 ? 's' : ''} selected
        </span>
        <Button
          size="sm"
          variant="light"
          onPress={onClearSelection}
          className="text-primary-600 dark:text-primary-400"
        >
          Clear Selection
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {/* Publish */}
        <Button
          size="sm"
          color="success"
          variant="flat"
          startContent={<CheckSquare size={16} />}
          onPress={() => onBulkAction('publish')}
        >
          Publish
        </Button>

        {/* Archive */}
        <Button
          size="sm"
          color="warning"
          variant="flat"
          startContent={<Archive size={16} />}
          onPress={() => onBulkAction('archive')}
        >
          Archive
        </Button>

        {/* More Actions Dropdown */}
        <Dropdown>
          <DropdownTrigger>
            <Button
              size="sm"
              variant="flat"
            >
              More Actions
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Bulk Actions">
            <DropdownItem
              key="assign-category"
              startContent={<Tag size={16} />}
              onPress={() => onBulkAction('assign-category')}
            >
              Assign Category
            </DropdownItem>
            <DropdownItem
              key="change-status"
              startContent={<Globe size={16} />}
              onPress={() => onBulkAction('change-status')}
            >
              Change Status
            </DropdownItem>
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              startContent={<Trash2 size={16} />}
              onPress={() => onBulkAction('delete')}
            >
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}

