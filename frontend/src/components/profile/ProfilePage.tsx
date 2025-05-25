import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../page-layout/PageLayout';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <PageLayout>
      <div style={{ maxWidth: 400, margin: '60px auto', padding: 32, background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
        <h2 style={{ marginBottom: 24, fontWeight: 700 }}>Profile</h2>
        <div style={{ marginBottom: 16 }}><strong>Email:</strong> {user.email}</div>
        <div style={{ marginBottom: 16 }}><strong>Role:</strong> {user.role}</div>
        <div style={{ marginBottom: 16 }}><strong>Company ID:</strong> {user.company_id}</div>
      </div>
    </PageLayout>
  );
};

export default ProfilePage; 