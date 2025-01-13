import React, { useState } from 'react';
import { useAuth } from '../../hooks';
import { Alert, Button, Flex, Form, Input, Typography } from 'antd';
import styled from 'styled-components';
interface VerifyEmailProps {
  onVerifySuccess: () => void;
};

const { Title } = Typography;

const VerifyEmail: React.FC<VerifyEmailProps> = ({ onVerifySuccess }) => {
  const { user, verifyEmail } = useAuth();
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    verifyEmail(verificationCode, user.username)
      .then(() => {
        setIsLoading(false);
        onVerifySuccess();
      })
      .catch((err) => {
        setIsLoading(false);
        setError("Verify Email Error. Try again later...");
      });
  };

  return (
    <FormWrapper>
      <Form
        onFinish={handleSubmit} 
        autoComplete="off"
        style={{ maxWidth: "500px", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Title level={5} style={{ margin: "5px auto 15px" }}>
          We sent you an email with the verification code.
          <br />
          Please check your inbox (or spam in case you haven’t received it)
        </Title>
        <Form.Item name="emailConfirmationCode" rules={[{ required: true, message: "Please input verification code!" }]} style={{ maxWidth: "300px" }}>
          <Input
            disabled={isLoading}
            placeholder="Verification code"
            title="Verification code"
            onChange={(e) => setVerificationCode(e.target.value)}
            size="large"
            autoFocus
          />
        </Form.Item>

        {error && (
          <Form.Item>
            <Alert message={error} type="error" showIcon />
          </Form.Item>
        )}

        <Flex justify='space-between' align='center'>
          <Button
            type="text"
            onClick={() => {}}
            disabled={isLoading}
          >
            Resend email
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
          >
            Confirm email
          </Button>
        </Flex>
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

export default VerifyEmail;
