import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from '@nextui-org/react';
import { FiClock, FiUser, FiTag, FiCheckCircle, FiEdit, FiXCircle } from 'react-icons/fi';
import { useState } from 'react';
import ReviewForm from './ReviewForm';

// Assuming the same Article type from ReviewQueue.tsx
interface Article {
  id: string;
  translations: { title: string; excerpt?: string }[];
  author: { name: string; avatar?: string };
  category: { nameEn: string; nameMs?: string };
  updatedAt: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
}

interface ReviewCardProps {
  article: Article;
}

const ReviewCard = ({ article }: ReviewCardProps) => {
  const { author, category, translations, updatedAt } = article;
  const mainTranslation = translations[0] || {};
  const secondaryTranslation = translations[1] || {};
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [actionType, setActionType] = useState<'approve' | 'request_changes' | 'reject' | null>(null);

  const handleActionClick = (type: 'approve' | 'request_changes' | 'reject') => {
    setActionType(type);
    onOpen();
  };

  const handleFormSubmit = (comment: string) => {
    console.log({
      action: actionType,
      comment,
      articleId: article.id,
    });
    onClose();
    // Here, you would typically trigger a mutation to update the review status
  };

  const modalTitle = {
    approve: 'Approve Article',
    request_changes: 'Request Changes',
    reject: 'Reject Article',
  };

  return (
    <>
      <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex gap-4 items-start p-6">
          <Avatar src={author.avatar} name={author.name?.charAt(0)} size="lg" />
          <div className="flex-grow">
            <h2 className="text-xl font-bold text-gray-800">{mainTranslation.title || 'Untitled'}</h2>
            {secondaryTranslation.title && (
              <h3 className="text-md font-light text-gray-500">{secondaryTranslation.title}</h3>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FiUser />
                <span>{author.name || 'Unknown Author'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiTag />
                <span>{category.nameEn || 'Uncategorized'}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-6 pb-4">
          <p className="text-gray-700">{mainTranslation.excerpt || 'No excerpt available.'}</p>
        </CardBody>
        <CardFooter className="flex justify-between items-center p-6 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiClock />
            <span>Submitted on {new Date(updatedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex gap-2">
            <Button
              color="success"
              variant="flat"
              size="sm"
              startContent={<FiCheckCircle />}
              onPress={() => handleActionClick('approve')}
            >
              Approve
            </Button>
            <Button
              color="warning"
              variant="flat"
              size="sm"
              startContent={<FiEdit />}
              onPress={() => handleActionClick('request_changes')}
            >
              Request Changes
            </Button>
            <Button
              color="danger"
              variant="flat"
              size="sm"
              startContent={<FiXCircle />}
              onPress={() => handleActionClick('reject')}
            >
              Reject
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} placement="center">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {actionType ? modalTitle[actionType] : 'Review Action'}
              </ModalHeader>
              <ModalBody>
                <p>You are about to {actionType?.replace('_', ' ')} the article titled "{mainTranslation.title}". Please provide a comment below.</p>
                <ReviewForm onSubmit={handleFormSubmit} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReviewCard;
