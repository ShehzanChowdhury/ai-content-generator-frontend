import ProtectedRoute from '../../components/ProtectedRoute';
import Navbar from '../../components/Navbar';
import ContentForm from './ContentForm';

export default function CreatePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <ContentForm />
      </div>
    </ProtectedRoute>
  );
}


