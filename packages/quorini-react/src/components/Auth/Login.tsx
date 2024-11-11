import React, { useState } from 'react';
import styled from "styled-components"
import { Button, Input, Form, Alert, Flex, Checkbox } from "antd"
import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { useAuth } from '../../hooks';

interface LoginProps {
  onLoginSuccess: () => void;
  onSignupClick: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSignupClick }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = () => {
    setIsLoading(true);
    login(username, password)
      .then(() => {
        setIsLoading(false);
        onLoginSuccess();
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("login-err", err);
        setError("Invalid username or password");
      });
  };

  return (
    <LoginWrapper>
      <Form onFinish={handleLogin} autoComplete="off">
        <Form.Item name="username" rules={[{ required: true, message: "Please input your email address!" }]}>
          <Input
            prefix={<UserOutlined />}
            placeholder="Email address..."
            title="Email address..."
            onChange={(e) => setUsername(e.target.value)}
            size="large"
            style={{ width: "300px" }}
            autoFocus
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
            {
              pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).+$/,
              message: "Should contain at least 1 uppercase, 1 lowercase, 1 digit and 1 special charecter.",
            },
            {
              min: 8,
              message: "Should be at least 8 characters.",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password..."
            title="Password..."
            onChange={(e) => setPassword(e.target.value)}
            size="large"
            style={{ width: "300px" }}
          />
        </Form.Item>

        {error && (
          <Form.Item>
            <Alert message={error} type="error" showIcon />
          </Form.Item>
        )}

        <Form.Item>
          <Flex justify="space-between" align="center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a href="">Forgot password</a>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit" loading={isLoading}>
            Log in
          </Button>
          or <a href="">Sign up now!</a>
        </Form.Item>
      </Form>
    </LoginWrapper>
  );
};

const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  align-items: center;
`;

export default Login;
