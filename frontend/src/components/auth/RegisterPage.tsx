import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import ButtonPrimary from '../button-primary/button-primary.component';

const PageBg = styled.div<{ $colors: any }>`
  min-height: 100vh;
  background: ${({ $colors }) => $colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 100vw;
  overflow: auto;
`;
const Card = styled.div<{ $colors: any }>`
  max-width: 400px;
  width: 100%;
  min-width: 0;
  min-height: 420px;
  padding: 32px;
  background: ${({ $colors }) => $colors.card || '#232136'};
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  color: ${({ $colors }) => $colors.text};
  box-sizing: border-box;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 500px) {
    padding: 18px 8px;
    max-width: 98vw;
    min-width: 0;
    margin: 0 auto;
  }
`;
const Title = styled.h2`
  margin-bottom: 24px;
  font-weight: 700;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const Input = styled.input<{ $colors: any }>`
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: ${({ $colors }) => $colors.input || '#fff'};
  color: #000;
`;
const Select = styled.select<{ $colors: any }>`
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: ${({ $colors }) => $colors.input || '#fff'};
  color: #000;
`;
const LogoImage = styled.img`
  height: 120px;
  margin-bottom: 2rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const success = await register(company, email, password, role);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Registration failed');
    }
  };

  return (
    <PageBg $colors={colors}>
      <div style={{ width: '100%' }}>
        <LogoImage src="/logo-transparent.png" alt="Watcher AI Logo" />
        <Card $colors={colors}>
          <Title>Register</Title>
          <Form onSubmit={handleSubmit}>
            <label>Company</label>
            <Input $colors={colors} type="text" value={company} onChange={e => setCompany(e.target.value)} required />
            <label>Email</label>
            <Input $colors={colors} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <label>Password</label>
            <Input $colors={colors} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            <label>Role</label>
            <Select $colors={colors} value={role} onChange={e => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Select>
            {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
            <ButtonPrimary type="submit" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
              {loading ? 'Registering...' : 'Register'}
            </ButtonPrimary>
          </Form>
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <span>Already have an account? </span>
            <Link to="/login">Sign In</Link>
          </div>
        </Card>
      </div>
    </PageBg>
  );
};

export default RegisterPage;