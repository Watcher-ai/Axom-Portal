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
  padding: 2rem 0;
  width: 100vw;
  overflow: auto;
`;
const Card = styled.div<{ $colors: any }>`
  max-width: 400px;
  width: 100%;
  padding: 32px;
  background: ${({ $colors }) => $colors.card || '#232136'};
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  color: ${({ $colors }) => $colors.text};
  box-sizing: border-box;
  @media (max-width: 500px) {
    padding: 18px 8px;
    max-width: 98vw;
    min-width: 0;
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
const LogoImage = styled.img`
  height: 120px;
  margin-bottom: 2rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <PageBg $colors={colors}>
      <div style={{ width: '100%' }}>
        <LogoImage src="/logo-transparent.png" alt="Watcher AI Logo" />
        <Card $colors={colors}>
          <Title>Sign In</Title>
          <Form onSubmit={handleSubmit}>
            <label>Email</label>
            <Input $colors={colors} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <label>Password</label>
            <Input $colors={colors} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
            <ButtonPrimary type="submit" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </ButtonPrimary>
          </Form>
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <span>Don't have an account? </span>
            <Link to="/register">Register</Link>
          </div>
        </Card>
      </div>
    </PageBg>
  );
};

export default LoginPage;
