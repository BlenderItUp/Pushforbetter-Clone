import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const { login, createUser, error } = useAuth();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (username) {
      await login(username);
    }
  };

  const handleCreateAccount = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newUsername) {
      await createUser(newUsername);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Login</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
          <button type="submit">Login</button>
        </form>
      </div>
      <div className="create-account-container">
        <h1>Create Account</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleCreateAccount}>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Enter new username"
          />
          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
