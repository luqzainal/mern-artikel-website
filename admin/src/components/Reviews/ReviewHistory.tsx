import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { FiArchive } from 'react-icons/fi';

// Static data for demonstration
const historyEvents = [
  {
    id: '1',
    action: 'Submitted',
    user: 'Author Name',
    date: '2023-10-26T10:00:00Z',
    comment: 'Initial submission for review.',
  },
  {
    id: '2',
    action: 'Assigned',
    user: 'Admin User',
    date: '2023-10-26T11:00:00Z',
    comment: 'Assigned to John Doe for review.',
  },
  {
    id: '3',
    action: 'Commented',
    user: 'John Doe',
    date: '2023-10-27T14:30:00Z',
    comment: 'Requested minor changes to the introduction.',
  },
  {
    id: '4',
    action: 'Approved',
    user: 'John Doe',
    date: '2023-10-28T16:00:00Z',
    comment: 'Looks good. Approved for publishing.',
  },
];

type HistoryEvent = typeof historyEvents[0];

interface ReviewHistoryProps {
  events?: HistoryEvent[];
}

const ReviewHistory = ({ events = historyEvents }: ReviewHistoryProps) => {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b">
        <FiArchive className="text-gray-600" />
        <h3 className="text-md font-semibold text-gray-800">Review History</h3>
      </CardHeader>
      <CardBody className="p-4">
        <div className="relative border-l-2 border-gray-200 ml-3">
          {events.map((event, index) => (
            <div key={event.id} className="mb-6 ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                <p className="text-blue-800 text-xs">{index + 1}</p>
              </span>
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-gray-900">{event.action} by {event.user}</p>
                  <time className="text-xs font-normal text-gray-500">{new Date(event.date).toLocaleString()}</time>
                </div>
                <p className="text-sm font-normal text-gray-600">{event.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default ReviewHistory;
