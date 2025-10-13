import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Spinner, Card, CardBody } from '@nextui-org/react';
import ReviewCard from './ReviewCard';

// Define the type for a single article for better type safety
interface ApiArticle {
  id: string;
  status: string;
  // Add other relevant article properties here
  translations: { title: string; excerpt?: string }[];
  author: { name: string; avatar?: string };
  category: { nameEn: string; nameMs?: string };
  updatedAt: string;
}

interface ApiResponse {
  articles: ApiArticle[];
  // Include other response properties if any, e.g., total, page
}

const ReviewQueue = () => {
  const {
    data: articlesData,
    isLoading,
    isError,
  } = useQuery<ApiResponse, Error>({
    queryKey: ['pending-reviews'],
    queryFn: async () => {
      const { data } = await api.get('/api/articles', {
        params: {
          status: 'PENDING_REVIEW',
        },
      });
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner label="Loading pending reviews..." size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardBody>
          <p className="text-danger-500">
            Error loading reviews. Please try again later.
          </p>
        </CardBody>
      </Card>
    );
  }

  const articles = articlesData?.articles || [];

  return (
    <div>
      {articles.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-center text-gray-500">
              No articles are currently pending review. Great job!
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <ReviewCard key={article.id} article={article as any} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewQueue;
