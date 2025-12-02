import Link from 'next/link';
import Button from '../../components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl">
            AI Content Generator
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Create high-quality, AI-powered content with ease. Generate blog posts, articles,
            product descriptions, and more.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link href="/login">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-indigo-600 text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Blog Posts</h3>
            <p className="text-gray-600">Generate structured blog post outlines and full articles</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-indigo-600 text-4xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Descriptions</h3>
            <p className="text-gray-600">Create compelling product descriptions that sell</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-indigo-600 text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Social Media</h3>
            <p className="text-gray-600">Generate engaging social media captions</p>
          </div>
        </div>
      </div>
    </div>
  );
}


