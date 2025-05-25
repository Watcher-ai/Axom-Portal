import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const sidebarLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/company', label: 'Company' },
  { to: '/agents', label: 'Agents' },
  { to: '/profile', label: 'Profile' },
];

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f7f9fb' }}>
      <aside style={{ width: 220, background: '#1a2341', color: '#fff', display: 'flex', flexDirection: 'column', padding: '32px 0' }}>
        <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 40, textAlign: 'center', letterSpacing: 1 }}>Watcher</div>
        <nav style={{ flex: 1 }}>
          {sidebarLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                display: 'block',
                padding: '12px 32px',
                color: isActive ? '#2d6cdf' : '#fff',
                background: isActive ? '#fff' : 'transparent',
                borderRadius: 8,
                margin: '4px 0',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'background 0.2s',
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} style={{ margin: 32, padding: 10, borderRadius: 6, background: '#e74c3c', color: '#fff', fontWeight: 600, border: 'none' }}>
          Logout
        </button>
      </aside>
      <main style={{ flex: 1, padding: '40px 5vw', minHeight: '100vh' }}>{children}</main>
    </div>
  );
};

export default PageLayout; 