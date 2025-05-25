import React, { useEffect, useState } from 'react';
import PageLayout from '../page-layout/PageLayout';
import { useAuth } from '../../context/AuthContext';

const CompanyPage: React.FC = () => {
  const { token } = useAuth();
  const [company, setCompany] = useState<{ id: string; name: string } | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editName, setEditName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('user');
  const [inviteMsg, setInviteMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/v1/company', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok) {
          setCompany(data);
          setEditName(data.name);
        } else {
          setError(data.error || 'Failed to load company');
        }
        const res2 = await fetch('/api/v1/company/users', { headers: { Authorization: `Bearer ${token}` } });
        const data2 = await res2.json();
        if (res2.ok) setUsers(data2);
      } catch {
        setError('Failed to load company');
      }
      setLoading(false);
    };
    fetchData();
  }, [token]);

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/v1/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editName }),
      });
      if (res.ok) {
        setCompany(c => c ? { ...c, name: editName } : c);
      } else {
        setError('Failed to update name');
      }
    } catch {
      setError('Failed to update name');
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteMsg('');
    try {
      const res = await fetch('/api/v1/company/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      if (res.ok) {
        setInviteMsg('User invited!');
        setInviteEmail('');
        setInviteRole('user');
      } else {
        setInviteMsg('Failed to invite user');
      }
    } catch {
      setInviteMsg('Failed to invite user');
    }
  };

  return (
    <PageLayout>
      <h1 style={{ fontWeight: 700, marginBottom: 24 }}>Company</h1>
      {loading ? <div>Loading...</div> : error ? <div style={{ color: 'red' }}>{error}</div> : (
        <>
          <form onSubmit={handleNameUpdate} style={{ marginBottom: 32 }}>
            <label style={{ fontWeight: 500 }}>Company Name</label>
            <input value={editName} onChange={e => setEditName(e.target.value)} style={{ marginLeft: 12, padding: 6, borderRadius: 6, border: '1px solid #ccc' }} />
            <button type="submit" style={{ marginLeft: 12, padding: '6px 18px', borderRadius: 6, background: '#2d6cdf', color: '#fff', border: 'none', fontWeight: 600 }}>Update</button>
          </form>
          <h2 style={{ fontWeight: 600, marginBottom: 12 }}>Users</h2>
          <table style={{ width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 32 }}>
            <thead>
              <tr style={{ background: '#f7f9fb' }}>
                <th style={{ textAlign: 'left', padding: 10 }}>Email</th>
                <th style={{ textAlign: 'left', padding: 10 }}>Role</th>
                <th style={{ textAlign: 'left', padding: 10 }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ padding: 10 }}>{u.email}</td>
                  <td style={{ padding: 10 }}>{u.role}</td>
                  <td style={{ padding: 10 }}>{new Date(u.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2 style={{ fontWeight: 600, marginBottom: 12 }}>Invite User</h2>
          <form onSubmit={handleInvite} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
            <input type="email" placeholder="Email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" style={{ padding: '8px 18px', borderRadius: 6, background: '#2d6cdf', color: '#fff', border: 'none', fontWeight: 600 }}>Invite</button>
          </form>
          {inviteMsg && <div style={{ color: inviteMsg === 'User invited!' ? 'green' : 'red' }}>{inviteMsg}</div>}
        </>
      )}
    </PageLayout>
  );
};

export default CompanyPage; 