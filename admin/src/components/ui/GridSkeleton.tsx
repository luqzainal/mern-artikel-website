import { Skeleton } from '@nextui-org/react';

const GridSkeleton = ({ items = 12 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: items }).map((_, i) => (
        <Skeleton key={i} className="rounded-lg">
          <div className="h-40 rounded-lg bg-default-300"></div>
        </Skeleton>
      ))}
    </div>
  );
};

export default GridSkeleton;
