import React, { useState } from 'react';

const VerifyEmail: React.FC<{ onVerifySuccess: () => void }> = ({ onVerifySuccess }) => {
  const [verificationCode, setVerificationCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerifySuccess();
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
    </form>
  );
};

export default VerifyEmail;
