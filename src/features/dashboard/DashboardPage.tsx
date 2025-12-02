import ProtectedRoute from '../../components/ProtectedRoute';
import Navbar from '../../components/Navbar';
import DashboardContent from './DashboardContent';
import Link from 'next/link';
import Button from '../../components/ui/Button';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-2 text-gray-600">Manage your AI-generated content</p>
            </div>
            <Link href="/create">
              <Button>Create New Content</Button>
            </Link>
          </div>
          <DashboardContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}


