import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-4 max-w-lg"
      >
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-error-100">
          <AlertTriangle className="h-10 w-10 text-error-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">Page Not Found</h1>
        
        <p className="text-lg text-neutral-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/">
          <Button variant="primary" size="lg">
            <Home className="h-5 w-5 mr-2" />
            Return Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;