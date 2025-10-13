import { Button, ButtonGroup } from '@nextui-org/react';
import { FiCheckCircle, FiXCircle, FiTrash } from 'react-icons/fi';

interface BulkActionsProps {
  selectedCount: number;
  onBulkAction: (action: 'approve' | 'spam' | 'delete') => void;
}

const BulkActions = ({ selectedCount, onBulkAction }: BulkActionsProps) => {
  const isDisabled = selectedCount === 0;

  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
      <p className="text-sm text-gray-700">
        {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
      </p>
      <ButtonGroup>
        <Button
          variant="flat"
          color="success"
          startContent={<FiCheckCircle />}
          isDisabled={isDisabled}
          onPress={() => onBulkAction('approve')}
        >
          Approve
        </Button>
        <Button
          variant="flat"
          color="warning"
          startContent={<FiXCircle />}
          isDisabled={isDisabled}
          onPress={() => onBulkAction('spam')}
        >
          Mark as Spam
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

export default BulkActions;
