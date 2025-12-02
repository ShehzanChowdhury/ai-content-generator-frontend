import Skeleton from '../../components/ui/Skeleton';

export default function ContentDetailSkeleton() {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Skeleton variant="text" width="300px" height="32px" className="mb-2" />
            <div className="flex items-center space-x-4">
              <Skeleton variant="text" width="150px" height="16px" />
              <Skeleton variant="text" width="20px" height="16px" />
              <Skeleton variant="text" width="180px" height="16px" />
            </div>
          </div>
          <Skeleton variant="rectangular" width="100px" height="28px" className="rounded-full" />
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <Skeleton variant="text" width="100px" height="24px" />
          <Skeleton variant="text" width="60px" height="20px" />
        </div>
        <div className="space-y-3">
          <Skeleton variant="text" width="100%" height="16px" />
          <Skeleton variant="text" width="100%" height="16px" />
          <Skeleton variant="text" width="95%" height="16px" />
          <Skeleton variant="text" width="100%" height="16px" />
          <Skeleton variant="text" width="90%" height="16px" />
          <Skeleton variant="text" width="100%" height="16px" />
          <Skeleton variant="text" width="98%" height="16px" />
        </div>
      </div>
    </div>
  );
}

