import { Avatar, Button, Chip, Checkbox } from '@nextui-org/react';
import { FiCheck, FiX, FiTrash2 } from 'react-icons/fi';

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
  status: 'approved' | 'pending' | 'spam';
}

interface CommentCardProps {
  comment: Comment;
  isSelected: boolean;
  onSelectionChange: (id: string) => void;
  onAction: (commentId: string, action: 'approve' | 'spam' | 'delete') => void;
}

const statusColors: { [key: string]: 'success' | 'warning' | 'danger' } = {
  approved: 'success',
  pending: 'warning',
  spam: 'danger',
};

const CommentCard = ({ comment, isSelected, onSelectionChange, onAction }: CommentCardProps) => {
  return (
    <div className={`p-4 border rounded-lg shadow-sm flex gap-4 ${isSelected ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}>
      <Checkbox
        isSelected={isSelected}
        onValueChange={() => onSelectionChange(comment.id)}
        aria-label={`Select comment by ${comment.author}`}
      />
      <div className="flex items-start gap-4 flex-grow">
        <Avatar src={comment.avatar} name={comment.author.charAt(0)} />
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-semibold">{comment.author}</span>
              <time className="ml-2 text-xs text-gray-500">
                {new Date(comment.date).toLocaleString()}
              </time>
            </div>
            <Chip color={statusColors[comment.status]} size="sm" variant="flat">
              {comment.status}
            </Chip>
          </div>
          <p className="mt-2 text-gray-700">{comment.content}</p>
          <div className="flex gap-2 mt-3">
            {comment.status !== 'approved' && (
              <Button
                size="sm"
                variant="flat"
                color="success"
                startContent={<FiCheck />}
                onPress={() => onAction(comment.id, 'approve')}
              >
                Approve
              </Button>
            )}
            {comment.status !== 'spam' && (
              <Button
                size="sm"
                variant="flat"
                color="warning"
                startContent={<FiX />}
                onPress={() => onAction(comment.id, 'spam')}
              >
                Mark as Spam
              </Button>
            )}
            <Button
              size="sm"
              variant="flat"
              color="danger"
              startContent={<FiTrash2 />}
              onPress={() => onAction(comment.id, 'delete')}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
