import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../Home.component';
import LoginPage from '../auth/LoginPage';
import RegisterPage from '../auth/RegisterPage';
import DashboardPage from '../dashboard/dashboard-page.component';
import ProfilePage from '../profile/ProfilePage';
import CompanyPage from '../company/CompanyPage';
import AgentsPage from '../agents/AgentsPage';
import PrivacyPolicyPage from '../privacy/PrivacyPolicyPage';
import { useAuth } from '../../context/AuthContext';

function RequireAuth({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
    <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
    <Route path="/company" element={<RequireAuth><CompanyPage /></RequireAuth>} />
    <Route path="/agents" element={<RequireAuth><AgentsPage /></RequireAuth>} />
    <Route path="/privacy" element={<PrivacyPolicyPage />} />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default AppRouter;