import { Vote } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-blue-100 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Vote className="h-16 w-16 mx-auto text-blue-600 mb-8" />
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to E-Voting Platform
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Exercise your right to vote securely and conveniently from anywhere. 
            Your voice matters in shaping our future.
          </p>
          <div className="space-y-4">
            <Link
              to="/voting"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
            >
              Vote Now
            </Link>
            <p className="text-sm text-gray-500">
              New user? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}