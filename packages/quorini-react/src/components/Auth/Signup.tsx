import React, { useState } from 'react';

const Signup: React.FC<{ onSignupSuccess: () => void }> = ({ onSignupSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignupSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
      <button type="submit">Signup</button>
    </form>
  );
};

export default Signup;
