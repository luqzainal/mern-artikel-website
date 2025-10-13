import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { FiMessageSquare } from 'react-icons/fi';
import { useState } from 'react';
import CommentCard, { Comment } from './CommentCard';
import CommentFilters, { CommentStatusFilter } from './CommentFilters';
import BulkActions from './BulkActions';

// Static data for demonstration
const commentsData: Comment[] = [
  {
    id: '1',
    author: 'Commenter One',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024e',
    content: 'This is a very insightful article. Thank you for sharing!',
    date: '2023-10-28T10:00:00Z',
    status: 'approved',
  },
  {
    id: '2',
    author: 'Commenter Two',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    content: 'I have a question about the second paragraph. Can you elaborate?',
    date: '2023-10-28T11:30:00Z',
    status: 'pending',
  },
  {
    id: '3',
    author: 'Spam Bot',
    avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702g',
    content: 'Visit my website for amazing deals!',
    date: '2023-10-28T12:00:00Z',
    status: 'spam',
  },
];

const CommentsList = () => {
  const [activeFilter, setActiveFilter] = useState<CommentStatusFilter>('all');
  const [selectedComments, setSelectedComments] = useState<string[]>([]);

  const handleSelectionChange = (id: string) => {
    setSelectedComments(prev =>
      prev.includes(id) ? prev.filter(commentId => commentId !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: 'approve' | 'spam' | 'delete') => {
    console.log(`Performing bulk ${action} on comments:`, selectedComments);
    // Bulk mutation logic will be added here
    setSelectedComments([]);
  };

  const handleAction = (commentId: string, action: 'approve' | 'spam' | 'delete') => {
    console.log(`Performing ${action} on comment ${commentId}`);
    // Mutation logic will be added here
  };

  const filteredComments = commentsData.filter(comment => {
    if (activeFilter === 'all') return true;
    return comment.status === activeFilter;
  });

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b">
        <FiMessageSquare className="text-gray-600" />
        <h3 className="text-md font-semibold text-gray-800">Comments Moderation</h3>
      </CardHeader>
      <CardBody className="p-4">
        <CommentFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <div className="my-4">
          <BulkActions selectedCount={selectedComments.length} onBulkAction={handleBulkAction} />
        </div>
        <div className="space-y-4 mt-4">
          {filteredComments.length > 0 ? (
            filteredComments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                isSelected={selectedComments.includes(comment.id)}
                onSelectionChange={handleSelectionChange}
                onAction={handleAction}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">No comments match the current filter.</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default CommentsList;
