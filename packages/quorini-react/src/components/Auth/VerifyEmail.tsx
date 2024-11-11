import React, { useState } from 'react';
import { useAuth } from '../../hooks';
interface VerifyEmailProps {
  onVerifySuccess: () => void;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ onVerifySuccess }) => {
  const { user, verifyEmail } = useAuth();
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyEmail(verificationCode, user.username);
      onVerifySuccess();
    } catch (error) {
      setError("sign up err. try again");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Verify Email</h2>
      <input
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        placeholder="Verification Code"
      />
      <button type="submit">Verify</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default VerifyEmail;
