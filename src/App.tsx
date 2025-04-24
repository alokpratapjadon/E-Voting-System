import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import VotingPage from './pages/VotingPage';
import ResultsPage from './pages/ResultsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminCandidates from './pages/AdminCandidates';
import AdminSettings from './pages/AdminSettings';
import NotFoundPage from './pages/NotFoundPage';
import { useAuthStore } from './stores/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Check if user is already logged in on app initialization
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        
        {/* Protected voter routes */}
        <Route path="voting" element={
          <ProtectedRoute>
            <VotingPage />
          </ProtectedRoute>
        } />
        
        <Route path="results" element={<ResultsPage />} />
        
        {/* Admin routes */}
        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route path="admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="admin/candidates" element={
          <AdminRoute>
            <AdminCandidates />
          </AdminRoute>
        } />
        <Route path="admin/settings" element={
          <AdminRoute>
            <AdminSettings />
          </AdminRoute>
        } />
        
        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;