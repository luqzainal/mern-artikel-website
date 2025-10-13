import ReviewQueue from '../components/Reviews/ReviewQueue';

export default function ReviewManagement() {
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Review Management</h1>
        <p className="text-gray-600 mt-2">
          Manage and process all pending article reviews from this dashboard.
        </p>
      </div>

      <ReviewQueue />
    </div>
  );
}
