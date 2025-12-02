import Skeleton from '../../components/ui/Skeleton';

export default function DashboardSkeleton() {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Skeleton variant="text" width="60px" height="16px" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Skeleton variant="text" width="50px" height="16px" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Skeleton variant="text" width="60px" height="16px" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Skeleton variant="text" width="70px" height="16px" />
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Skeleton variant="text" width="70px" height="16px" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton variant="text" width="200px" height="20px" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton variant="text" width="120px" height="16px" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton variant="rectangular" width="80px" height="24px" className="rounded-full" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton variant="text" width="100px" height="16px" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end space-x-4">
                    <Skeleton variant="text" width="50px" height="16px" />
                    <Skeleton variant="text" width="60px" height="16px" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

