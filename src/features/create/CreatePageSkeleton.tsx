import Skeleton from '../../components/ui/Skeleton';

export default function CreatePageSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Skeleton variant="text" width="250px" height="36px" className="mb-2" />
        <Skeleton variant="text" width="400px" height="20px" />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <Skeleton variant="text" width="80px" height="16px" className="mb-2" />
            <Skeleton variant="rectangular" width="100%" height="120px" />
            <div className="mt-1 flex justify-between">
              <Skeleton variant="text" width="200px" height="12px" />
              <Skeleton variant="text" width="60px" height="12px" />
            </div>
          </div>

          <div>
            <Skeleton variant="text" width="120px" height="16px" className="mb-2" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} variant="rectangular" width="100%" height="100px" className="rounded-lg" />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Skeleton variant="rectangular" width="100px" height="40px" className="rounded-md" />
            <Skeleton variant="rectangular" width="150px" height="40px" className="rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

