import React, { useState } from 'react';
import styled from "styled-components"
import { Button, Input, Typography, Form } from "antd"
import { KeyOutlined, LoadingOutlined, LockOutlined, UserOutlined } from "@ant-design/icons"
import { useAuth } from '../../hooks';
import { Colors, Spaces } from '../styles';

interface LoginProps {
  onLoginSuccess: () => void;
  onSignupClick: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSignupClick }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    login(username, password)
      .then(() => {
        onLoginSuccess();
      })
      .catch((err) => {
        console.log("login-err", err);
        setError("Invalid username or password");
      });
  };

  return (
    <div>
      {/* <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={onSignupClick}>Sign up</button>
      {error && <p style={{ color: 'red' }}>{error}</p>} */}
      <Selector
        onClick={() => { console.log("Selector-onClicked") }}
      >
        <SelectorOption selected={true}>
          <UserOutlined /> Log in
        </SelectorOption>
        <SelectorOption selected={false}>
          <KeyOutlined /> Sign up
        </SelectorOption>
      </Selector>

      <Form
        onFinish={() => { console.log("onFinish") }}
        autoComplete="off"
      >
        <Form.Item name="username" rules={[{ required: true, message: "Please input your email address!" }]}>
          <Input
            prefix={<UserOutlined />}
            placeholder="Email address..."
            title="Email address..."
            onChange={(e) => { console.log("onChange-email", e.target.value) }}
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
            // disabled={state.matches("authPage.loggingIn") || state.matches("authPage.signingUp")}
            prefix={<LockOutlined />}
            placeholder="Password..."
            title="Password..."
            onChange={(e) => { console.log("input.pass change", e.target.value) }}
            size="large"
            style={{ width: "300px" }}
          />
        </Form.Item>

        <div>
          <Button
            type="text"
            onClick={() => {  }}
          >
            Forgot password?
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            // loading={state.matches("authPage.loggingIn") || state.matches("authPage.signingUp")}
          >
            Log in
          </Button>
        </div>
      </Form>
    </div>
  );
};

const Selector = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0px;

    border-radius: 20px;
    border: 1px solid ${Colors.primary};
    cursor: pointer;
`;

const SelectorOption = styled.div<{ selected: boolean }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2px;

    font-size: 14px;
    padding: 3px ${Spaces.normal};
    border-radius: 20px;
    color: ${(props) => (props.selected ? Colors.background : Colors.primary)};
    background: ${(props) => (props.selected ? Colors.primary : Colors.background)};

    &:hover {
        background: ${(props) => (props.selected ? Colors.primaryHover : Colors.grayLight)};
    }
`;

export default Login;
