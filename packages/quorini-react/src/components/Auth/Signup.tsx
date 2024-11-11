import React, { useState } from 'react';
import { useAuth } from '../../hooks';
import styled from 'styled-components';
import { Alert, Button, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from "@ant-design/icons"

interface SignupProps {
  onSignupSuccess: () => void;
  onLoginClick: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignupSuccess, onLoginClick }) => {
  const { signup } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (password !== confirmPassword) {
      setError("Password not matched!");
      setIsLoading(false);
      return;
    }
    signup(username, password)
      .then(() => {
        setIsLoading(false);
        onSignupSuccess();
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("signup err", err);
        setError("sign up err. try again");
      });
  };

  return (
    <SignupWrapper>
      <Form onFinish={handleSignup} autoComplete="off">
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

        <Form.Item
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: "Please input your confirm password!",
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
            placeholder="Confirm Password..."
            title="Confirm Password..."
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          <Button block type="primary" htmlType="submit" loading={isLoading}>
            Sign up
          </Button>
          or <a href="#" onClick={onLoginClick}>Log in</a>
        </Form.Item>
      </Form>
    </SignupWrapper>
  );
};

const SignupWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  align-items: center;
`;

export default Signup;
