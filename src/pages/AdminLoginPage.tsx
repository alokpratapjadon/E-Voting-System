// pages/AdminLoginPage.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Info } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '../components/ui/Card';
import { useAuthStore } from '../stores/authStore';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { adminLogin } = useAuthStore();

  // Optional: Auto-fill demo credentials (for dev only)
  useEffect(() => {
    setEmail('admin@example.com');
    setPassword('admin123');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const success = await adminLogin({ email, password });

      if (success) {
        navigate('/admin');
      } else {
        setError('Invalid admin credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-neutral-600 mt-2">
              Login to access the election administration panel
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Admin Access</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  id="email"
                  type="email"
                  label="Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  fullWidth
                />
                <Input
                  id="password"
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  fullWidth
                />

                {error && (
                  <div className="p-3 bg-red-100 text-red-800 rounded-md text-sm flex items-start">
                    <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  fullWidth
                >
                  Admin Sign In
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-neutral-500">
                      Demo Credentials
                    </span>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm text-neutral-600">
                  <p>Email: admin@example.com</p>
                  <p>Password: admin123</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link
                to="/"
                className="text-sm text-neutral-600 hover:text-primary-600"
              >
                Back to Home
              </Link>
              <Link
                to="/login"
                className="text-sm text-neutral-600 hover:text-primary-600"
              >
                Voter Login
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLoginPage;