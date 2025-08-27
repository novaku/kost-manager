import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import HomePage from '@/components/pages/HomePage';
import LoginPage from '@/components/pages/LoginPage';
import RegisterPage from '@/components/pages/RegisterPage';
import ProfilePage from '@/components/pages/ProfilePage';
import KostanListPage from '@/components/pages/KostanListPage';
import KostanDetailPage from '@/components/pages/KostanDetailPage';
import DashboardPage from '@/components/pages/DashboardPage';
import MyKostansPage from '@/components/pages/MyKostansPage';
import MyRentalsPage from '@/components/pages/MyRentalsPage';
import PaymentsPage from '@/components/pages/PaymentsPage';
import PaymentDetailPage from '@/components/pages/PaymentDetailPage';
import RentalDetailPage from '@/components/pages/RentalDetailPage';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: 'owner' | 'tenant' }> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Public route component (redirect to dashboard if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const { isLoading } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/kostans" element={<Layout><KostanListPage /></Layout>} />
        <Route path="/kostans/:id" element={<Layout><KostanDetailPage /></Layout>} />
        
        {/* Auth routes (redirect if authenticated) */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Layout><LoginPage /></Layout>
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Layout><RegisterPage /></Layout>
            </PublicRoute>
          } 
        />

        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout><DashboardPage /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Layout><ProfilePage /></Layout>
            </ProtectedRoute>
          } 
        />

        {/* Owner-only routes */}
        <Route 
          path="/my-kostans" 
          element={
            <ProtectedRoute requiredRole="owner">
              <Layout><MyKostansPage /></Layout>
            </ProtectedRoute>
          } 
        />

        {/* Tenant-only routes */}
        <Route 
          path="/my-rentals" 
          element={
            <ProtectedRoute requiredRole="tenant">
              <Layout><MyRentalsPage /></Layout>
            </ProtectedRoute>
          } 
        />

        {/* Common protected routes */}
        <Route 
          path="/payments" 
          element={
            <ProtectedRoute>
              <Layout><PaymentsPage /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route
          path="/payments/:id"
          element={
            <ProtectedRoute>
              <Layout><PaymentDetailPage /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/rentals/:id"
          element={
            <ProtectedRoute>
              <Layout><RentalDetailPage /></Layout>
            </ProtectedRoute>
          }
        />

        {/* 404 route */}
        <Route 
          path="*" 
          element={
            <Layout>
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-lg text-gray-600 mb-8">{t('error.pageNotFound')}</p>
                  <a 
                    href="/" 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t('error.goHome')}
                  </a>
                </div>
              </div>
            </Layout>
          } 
        />
      </Routes>
    </div>
  );
};

export default App;
