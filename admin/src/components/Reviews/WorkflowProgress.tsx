import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { FiGitMerge } from 'react-icons/fi';

// Define the possible statuses for a review workflow
type WorkflowStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';

interface WorkflowProgressProps {
  status: WorkflowStatus;
}

const statusConfig = {
  PENDING_REVIEW: {
    title: 'Pending Review',
    description: 'The article is awaiting review from an editor.',
    color: 'bg-yellow-500',
  },
  APPROVED: {
    title: 'Approved',
    description: 'The article has been approved and is ready for publishing.',
    color: 'bg-green-500',
  },
  REJECTED: {
    title: 'Changes Requested',
    description: 'The article has been sent back to the author for changes.',
    color: 'bg-red-500',
  },
  PUBLISHED: {
    title: 'Published',
    description: 'The article has been published and is live.',
    color: 'bg-blue-500',
  },
};

const WorkflowProgress = ({ status }: WorkflowProgressProps) => {
  const currentStatus = statusConfig[status] || statusConfig.PENDING_REVIEW;

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b">
        <FiGitMerge className="text-gray-600" />
        <h3 className="text-md font-semibold text-gray-800">Workflow Status</h3>
      </CardHeader>
      <CardBody className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${currentStatus.color}`} />
          <div>
            <p className="font-bold text-gray-800">{currentStatus.title}</p>
            <p className="text-sm text-gray-600">{currentStatus.description}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default WorkflowProgress;
