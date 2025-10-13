import { useState } from 'react';
import { Textarea, Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { FiSend } from 'react-icons/fi';

interface ReviewFormProps {
  onSubmit: (comment: string) => void;
  isLoading?: boolean;
}

const ReviewForm = ({ onSubmit, isLoading = false }: ReviewFormProps) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(comment);
      setComment('');
    }
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="px-4 py-3 bg-gray-50 border-b">
        <h3 className="text-md font-semibold text-gray-800">Leave a Review Comment</h3>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <Textarea
            label="Your Comment"
            placeholder="Provide detailed feedback for the author..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            minRows={5}
            disabled={isLoading}
            required
          />
          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              color="primary"
              isLoading={isLoading}
              disabled={!comment.trim()}
              startContent={!isLoading && <FiSend />}
            >
              Submit Comment
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default ReviewForm;
