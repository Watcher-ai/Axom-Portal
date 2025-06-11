import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, message } from 'antd';
import { GoogleOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const { Title } = Typography;

const Login = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        username: values.username,
        password: values.password,
        role: values.role || 'user'
      });
      message.success('Login successful!');
      onLoginSuccess(response.data);
    } catch (error) {
      message.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/login/google', {
        token: credentialResponse.credential,
        role: 'user'
      });
      message.success('Google login successful!');
      onLoginSuccess(response.data);
    } catch (error) {
      message.error(error.response?.data?.error || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
          Welcome to Portal
        </Title>
        
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Username" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              size="large"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>

        <Divider>Or</Divider>

        <div style={{ textAlign: 'center' }}>
          {/* <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => message.error('Google login failed')}
            useOneTap
          /> */}
        </div>
      </Card>
    </div>
  );
};

export default Login; 