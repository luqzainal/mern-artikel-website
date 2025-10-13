import { useState } from 'react';
import {
  Select,
  SelectItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Avatar,
} from '@nextui-org/react';
import { FiUserPlus } from 'react-icons/fi';

// Static data for demonstration purposes
const reviewers = [
  { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
  { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: '3', name: 'Peter Jones', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d' },
];

interface AssignReviewerProps {
  onAssign: (reviewerId: string) => void;
  isLoading?: boolean;
}

const AssignReviewer = ({ onAssign, isLoading = false }: AssignReviewerProps) => {
  const [selectedReviewer, setSelectedReviewer] = useState<string>('');

  const handleAssign = () => {
    if (selectedReviewer) {
      onAssign(selectedReviewer);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-sm">
      <CardHeader className="px-4 py-3 bg-gray-50 border-b">
        <h3 className="text-md font-semibold text-gray-800">Assign Reviewer</h3>
      </CardHeader>
      <CardBody className="p-4">
        <div className="flex flex-col gap-4">
          <Select
            label="Select a Reviewer"
            placeholder="Choose a reviewer to assign"
            selectedKeys={selectedReviewer ? [selectedReviewer] : []}
            onChange={(e) => setSelectedReviewer(e.target.value)}
            disabled={isLoading}
          >
            {reviewers.map((reviewer) => (
              <SelectItem key={reviewer.id} value={reviewer.id} textValue={reviewer.name}>
                <div className="flex gap-2 items-center">
                  <Avatar alt={reviewer.name} className="flex-shrink-0" size="sm" src={reviewer.avatar} />
                  <span className="text-small">{reviewer.name}</span>
                </div>
              </SelectItem>
            ))}
          </Select>
          <Button
            color="primary"
            onPress={handleAssign}
            isLoading={isLoading}
            disabled={!selectedReviewer}
            startContent={!isLoading && <FiUserPlus />}
          >
            Assign
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default AssignReviewer;
