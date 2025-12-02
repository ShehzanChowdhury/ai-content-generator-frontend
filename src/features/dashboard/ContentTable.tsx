'use client';

import { useRouter } from 'next/navigation';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatContentType, formatDateShort } from '../../utils/formatters';
import type { Content } from '../../store/contentSlice';

interface ContentTableProps {
  contents: Content[];
  onDelete: (id: string) => void;
}

export default function ContentTable({ contents, onDelete }: ContentTableProps) {
  const router = useRouter();

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Topic
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contents.map((content) => (
              <tr key={content.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{content.topic}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatContentType(content.contentType)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={content.jobStatus} size="sm" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatDateShort(content.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => router.push(`/content/${content.id}`)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onDelete(content.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-200">
        {contents.map((content) => (
          <div key={content.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {content.topic}
                </div>
              </div>
              <div className="ml-4 flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => router.push(`/content/${content.id}`)}
                  className="text-indigo-600 hover:text-indigo-900 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => onDelete(content.id)}
                  className="text-red-600 hover:text-red-900 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


