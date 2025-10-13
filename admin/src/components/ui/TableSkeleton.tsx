import { Card, CardBody, Skeleton } from '@nextui-org/react';

const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <Card>
      <CardBody className="space-y-4 p-4">
        {/* Header */}
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-8 flex-1 rounded-lg" />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            {Array.from({ length: columns }).map((_, j) => (
              <Skeleton key={j} className="h-10 flex-1 rounded-lg" />
            ))}
          </div>
        ))}
      </CardBody>
    </Card>
  );
};

export default TableSkeleton;
