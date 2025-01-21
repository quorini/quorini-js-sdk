import React, { useState } from 'react';
import { useAuth } from '../../hooks';
import styled from 'styled-components';
import { Alert, Button, Form, Input } from 'antd';
import { LockOutlined, UserOutlined, GiftOutlined } from "@ant-design/icons"
import { MetaData } from '../../utils';

interface SignupProps {
  onSignupSuccess: () => void;
  onLoginClick: () => void;
  onAcceptSuccess: () => void;
  formFields?: MetaData[];
  usergroup?: string;
}

const Signup: React.FC<SignupProps> = ({ onSignupSuccess, onLoginClick, onAcceptSuccess, formFields, usergroup }) => {
  const { signup, acceptInvitation } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const pathname = window.location.pathname;
  if (pathname.includes("set-password")) {
    const params = new URLSearchParams(window.location.search);
    const invitationEmail = params.get("email");

    const handleAcceptInvitation = (values: Record<string, any>) => {
      setIsLoading(true);
      const { password, code } = values;
      if (!invitationEmail) {
        setError("email address is not valid!");
        setIsLoading(false);
        return;
      }
      if (!password || password.length === 0) {
        setError("password is not valid!");
        setIsLoading(false);
        return;
      }
      if (!code || code.length === 0) {
        setError("invitation code is not valid!");
        setIsLoading(false);
        return;
      }
      acceptInvitation(invitationEmail, password, code)
        .then(() => {
          setIsLoading(false);
          onAcceptSuccess();
          window.location.href = `${window.location.origin}/`;
        })
        .catch(() => {
          setIsLoading(false);
          setError("sign up err. try again");
        });
    }

    if (invitationEmail) {
      return (
        <FormWrapper>
          <Form form={form} layout="vertical" onFinish={handleAcceptInvitation}>
            <Form.Item name="email" style={{ maxWidth: "300px" }}>
              <Input
                prefix={<UserOutlined />}
                size="large"
                style={{ width: "300px" }}
                defaultValue={invitationEmail}
                disabled
              />
            </Form.Item>

            <Form.Item
              name="code"
              rules={[
                {
                  required: true,
                  message: "Please input your invitation code! Copy/paste the code from invitation URL.",
                },
                {
                  pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).+$/,
                  message: "Should contain at least 1 uppercase, 1 lowercase, 1 digit and 1 special charecter.",
                },
              ]}
              style={{ maxWidth: "300px" }}
            >
              <Input
                prefix={<GiftOutlined />}
                placeholder="Inviation Code"
                size="large"
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
              style={{ maxWidth: "300px" }}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            {error && (
              <Form.Item>
                <Alert message={error} type="error" showIcon />
              </Form.Item>
            )}

            <Form.Item>
              <Button block type="primary" htmlType="submit" loading={isLoading}>
                Accept Invitation
              </Button>
              or <a href="#" onClick={onLoginClick}>Log in</a>
            </Form.Item>
          </Form>
        </FormWrapper>
      )
    }
  }

  const handleSignup = (values: Record<string, any>) => {
    setIsLoading(true);
    const {username, password, confirmPassword, ...rest} = values;

    if (password !== confirmPassword) {
      setError("Password not matched!");
      setIsLoading(false);
      return;
    }
    signup(username, password, "", rest, usergroup || "")
      .then(() => {
        setIsLoading(false);
        onSignupSuccess();
      })
      .catch((err) => {
        setIsLoading(false);
        setError("sign up err. try again");
      });
  };

  return (
    <FormWrapper>
      <Form form={form} layout="vertical" onFinish={handleSignup}>
      <Form.Item name="username" rules={[{ required: true, message: "Please input your email address!" }]} style={{ maxWidth: "300px" }}>
          <Input
            prefix={<UserOutlined />}
            placeholder="Email address..."
            title="Email address..."
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
          style={{ maxWidth: "300px" }}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password..."
            title="Password..."
            size="large"
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
          style={{ maxWidth: "300px" }}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm Password..."
            title="Confirm Password..."
            size="large"
          />
        </Form.Item>
        {formFields?.map((field) => (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            rules={[
              {
                required: field.required,
                message: `${field.label} is required`,
              },
            ]}
          >
            <Input placeholder={field.placeholder} />
          </Form.Item>
        ))}

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
    </FormWrapper>
  );
};

const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  align-items: center;
`;

export default Signup;
