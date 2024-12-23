import React, { useState } from 'react';
import styled from "styled-components"
import { Button, Input, Form, Alert, Flex, Checkbox } from "antd"
import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { useAuth } from '../../hooks';

interface LoginProps {
  onLoginSuccess: () => void;
  onSignupClick?: () => void;
  selfSignup?: boolean;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSignupClick, selfSignup }) => {
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
    <FormWrapper>
      <Form onFinish={handleLogin} autoComplete="off">
        <Form.Item name="username" rules={[{ required: true, message: "Please input your email address!" }]} style={{ maxWidth: "300px" }}>
          <Input
            prefix={<UserOutlined />}
            placeholder="Email address..."
            title="Email address..."
            onChange={(e) => setUsername(e.target.value)}
            size="large"
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
              min: 8,
              message: "Should be at least 8 characters.",
            },
          ]}
          style={{ maxWidth: "300px" }}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password..."
            title="Password..."
            onChange={(e) => setPassword(e.target.value)}
            size="large"
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
          {selfSignup && (<>or <a href="#" onClick={onSignupClick}>Sign up now!</a></>)}
        </Form.Item>
      </Form>
    </FormWrapper>
  );
};

const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  align-items: center;
`;

export default Login;
