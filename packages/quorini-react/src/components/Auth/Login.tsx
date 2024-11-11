import React, { useState } from 'react';
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

  const handleLogin = () => {
    login(username, password)
      .then(() => {
        // onLoginSuccess();
      })
      .catch((err) => {
        console.log("login-err", err);
        setError("Invalid username or password");
      });
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
      <button onClick={onSignupClick}>Sign up</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
