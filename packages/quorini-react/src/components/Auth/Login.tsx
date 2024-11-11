// src/components/Auth/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks';

const Login = () => {
  const { login } = useAuth(); // Auth hook provided by SDK
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      await login(username, password);
      // The `login` function should handle redirecting to dashboard or next step
    } catch (err) {
      setError("Invalid username or password"); // Display error message if login fails
    }
  };

  return (
    <div>
      <h2>Login</h2>
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
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
