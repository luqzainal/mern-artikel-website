import { Button, ButtonGroup } from '@nextui-org/react';
import { FiTrash, FiDownload } from 'react-icons/fi';

interface MediaBulkActionsProps {
  selectedCount: number;
  onBulkAction: (action: 'delete' | 'download') => void;
}

const MediaBulkActions = ({ selectedCount, onBulkAction }: MediaBulkActionsProps) => {
  const isDisabled = selectedCount === 0;

  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
      <p className="text-sm text-gray-700">
        {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
      </p>
      <ButtonGroup>
        <Button
          variant="flat"
          color="primary"
          startContent={<FiDownload />}
          isDisabled={isDisabled}
          onPress={() => onBulkAction('download')}
        >
          Download
        </Button>
        <Button
          variant="flat"
          color="danger"
          startContent={<FiTrash />}
          isDisabled={isDisabled}
          onPress={() => onBulkAction('delete')}
        >
          Delete
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default MediaBulkActions;
