import React, { useState } from 'react';
import api from '../services/api';

const loginOptions = [
  'Select',
  'System Administrator',
  'Normal User',
  'Store Owner',
];

function Login({ onLogin }) {
  const [loginUserType, setLoginUserType] = useState(loginOptions[0]);
  const [signupUserType, setSignupUserType] = useState(loginOptions[0]);
  const [loginForm, setLoginForm] = useState({
    identifier: '',
    password: '',
  });
  const [signupForm, setSignupForm] = useState({
    username: '',
    email: '',
    name: '',
    address: '',
    storeName: '',
    ownerName: '',
    password: '',
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      const endpointMap = {
        'System Administrator': '/api/admin/login',
        'Normal User': '/api/user/login',
        'Store Owner': '/api/store/login',
      };

      const payloadMap = {
        'System Administrator': {
          username: loginForm.identifier,
          password: loginForm.password,
        },
        'Normal User': {
          email: loginForm.identifier,
          password: loginForm.password,
        },
        'Store Owner': {
          email: loginForm.identifier,
          password: loginForm.password,
        },
      };

      const response = await api.post(endpointMap[loginUserType], payloadMap[loginUserType]);

      setStatusMessage('Login successful.');

      if (typeof onLogin === 'function') {
        onLogin(loginUserType, response.data.user);
      }
    } catch (error) {
      setStatusMessage(
        error.response?.data?.message || 'Login failed. Please check your details.'
      );
    }
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();

    const emailRegex = /^[a-z0-9_%+-]+(?:\.[a-z0-9_%+-]+)*[a-z0-9_%+-](?<![A-Z0-9])@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\/;']/;

    const getPasswordError = (password) => {
      if (password.length < 8 || password.length > 16) {
        return 'Password must be between 8 and 16 characters.';
      }
      if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter.';
      }
      if (!specialCharRegex.test(password)) {
        return 'Password must contain at least one special character.';
      }
      return '';
    };

    if (signupUserType === 'System Administrator') {
      const usernameRegex = /^[a-zA-Z]{20,60}$/;

if (!usernameRegex.test(signupForm.username)) {
  setStatusMessage(
    'Username must contain only alphabets and be between 20 and 60 characters.'
  );
  return;
}

if (!emailRegex.test(signupForm.email)) {
  setStatusMessage('Please enter a valid email address.');
  return;
}

const passwordError = getPasswordError(signupForm.password);
      if (passwordError) {
        setStatusMessage(passwordError);
        return;
      }
    } else if (signupUserType === 'Normal User') {
      if (signupForm.name.length < 20 || signupForm.name.length > 60) {
        setStatusMessage('Name must be between 20 and 60 characters.');
        return;
      }

      if (!emailRegex.test(signupForm.email)) {
        setStatusMessage('Please enter a valid email address.');
        return;
      }

      if (signupForm.address.length > 400) {
        setStatusMessage('Address must not exceed 400 characters.');
        return;
      }

      const passwordError = getPasswordError(signupForm.password);
      if (passwordError) {
        setStatusMessage(passwordError);
        return;
      }
    } else if (signupUserType === 'Store Owner') {
      if (signupForm.ownerName.length < 20 || signupForm.ownerName.length > 60) {
        setStatusMessage('Owner name must be between 20 and 60 characters.');
        return;
      }

      if (!emailRegex.test(signupForm.email)) {
        setStatusMessage('Please enter a valid email address.');
        return;
      }

      if (signupForm.address.length > 400) {
        setStatusMessage('Store address must not exceed 400 characters.');
        return;
      }

      const passwordError = getPasswordError(signupForm.password);
      if (passwordError) {
        setStatusMessage(passwordError);
        return;
      }
    }

    try {
      const endpointMap = {
        'System Administrator': '/api/admin/signup',
        'Normal User': '/api/user/signup',
        'Store Owner': '/api/store/signup',
      };

      const payloadMap = {
        'System Administrator': {
          username: signupForm.username,
          email: signupForm.email,
          password: signupForm.password,
        },
        'Normal User': {
          name: signupForm.name,
          email: signupForm.email,
          address: signupForm.address,
          password: signupForm.password,
        },
        'Store Owner': {
          storeName: signupForm.storeName,
          ownerName: signupForm.ownerName,
          address: signupForm.address,
          email: signupForm.email,
          password: signupForm.password,
        },
      };

      await api.post(endpointMap[signupUserType], payloadMap[signupUserType]);

      setStatusMessage('Signup successful. You can log in now.');
    } catch (error) {
      setStatusMessage(
        error.response?.data?.message || 'Signup failed. Please check your details.'
      );
    }
  };

  const renderSignupFields = () => {
    if (signupUserType === 'System Administrator') {
      return (
        <>
          <label>
            Username
            <input
              type="text"
              name="username"
              value={signupForm.username}
              onChange={(event) =>
                setSignupForm({ ...signupForm, username: event.target.value })
              }
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={signupForm.email}
              onChange={(event) =>
                setSignupForm({ ...signupForm, email: event.target.value })
              }
            />
          </label>
          <label>
            Password
            <input
              type={showSignupPassword ? 'text' : 'password'}
              name="password"
              value={signupForm.password}
              onChange={(event) =>
                setSignupForm({ ...signupForm, password: event.target.value })
              }
              minLength={8}
              maxLength={16}
            />
            <button type="button" className="password-toggle" onClick={() => setShowSignupPassword(!showSignupPassword)}>
              {showSignupPassword ? 'Hide' : 'Show'} password
            </button>
          </label>
        </>
      );
    }

    if (signupUserType === 'Normal User') {
      return (
        <>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={signupForm.name}
              onChange={(event) =>
                setSignupForm({ ...signupForm, name: event.target.value })
              }
              maxLength={60}
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={signupForm.email}
              onChange={(event) =>
                setSignupForm({ ...signupForm, email: event.target.value })
              }
            />
          </label>
          <label>
            Address
            <input
              type="text"
              name="address"
              value={signupForm.address}
              onChange={(event) =>
                setSignupForm({ ...signupForm, address: event.target.value })
              }
              maxLength={400}
            />
          </label>
          <label>
            Password
            <input
              type={showSignupPassword ? 'text' : 'password'}
              name="password"
              value={signupForm.password}
              onChange={(event) =>
                setSignupForm({ ...signupForm, password: event.target.value })
              }
              minLength={8}
              maxLength={16}
            />
            <button type="button" className="password-toggle" onClick={() => setShowSignupPassword(!showSignupPassword)}>
              {showSignupPassword ? 'Hide' : 'Show'} password
            </button>
          </label>
        </>
      );
    }

    return (
      <>
        <label>
          Store Name
          <input
            type="text"
            name="storeName"
            value={signupForm.storeName}
            onChange={(event) =>
              setSignupForm({ ...signupForm, storeName: event.target.value })
            }
          />
        </label>
        <label>
          Owner Name
          <input
            type="text"
            name="ownerName"
            value={signupForm.ownerName}
            onChange={(event) =>
              setSignupForm({ ...signupForm, ownerName: event.target.value })
            }
            maxLength={60}
          />
        </label>
        <label>
          Store Address
          <input
            type="text"
            name="address"
            value={signupForm.address}
            onChange={(event) =>
              setSignupForm({ ...signupForm, address: event.target.value })
            }
            maxLength={400}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={signupForm.email}
            onChange={(event) =>
              setSignupForm({ ...signupForm, email: event.target.value })
            }
          />
        </label>
        <label>
          Password
          <input
              type={showSignupPassword ? 'text' : 'password'}
            name="password"
            value={signupForm.password}
            onChange={(event) =>
              setSignupForm({ ...signupForm, password: event.target.value })
            }
            minLength={8}
            maxLength={16}
            />
            <button type="button" className="password-toggle" onClick={() => setShowSignupPassword(!showSignupPassword)}>
              {showSignupPassword ? 'Hide' : 'Show'} password
            </button>
        </label>
      </>
    );
  };

  return (
    <>
<style>{`
  .login-page {
    min-height: 100vh;
    background: linear-gradient(180deg, #233A66 0%, #D7A859 45%, #FFFFFF 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #2D2D2D;
  }

  .login-title {
    width: 100%;
    max-width: 920px;
    text-align: center;
    margin: 0 0 24px;
    font-size: 28px;
    font-weight: 800;
    color: #FFFFFF;
    letter-spacing: -0.01em;
    text-shadow: 0 2px 10px rgba(35, 58, 102, 0.25);
  }

  .login-card {
    display: flex;
    flex-wrap: wrap;
    gap: 0;
    width: 100%;
    max-width: 920px;
    background: #FFFFFF;
    border: 1px solid #E8D8B5;
    border-radius: 16px;
    box-shadow: 0 12px 40px rgba(35, 58, 102, 0.20);
    overflow: hidden;
  }

  .login-panel,
  .signup-panel {
    flex: 1 1 320px;
    padding: 36px 34px;
  }

  .login-panel {
    background: #F8F3E8;
    border-right: 1px solid #E8D8B5;
  }

  .signup-panel {
    background: #FFFFFF;
  }

  .login-panel h1 {
    margin: 0 0 4px;
    font-size: 21px;
    font-weight: 700;
    color: #233A66;
    letter-spacing: -0.01em;
  }

  .login-panel h2,
  .signup-panel h2 {
    margin: 0 0 20px;
    font-size: 16px;
    font-weight: 700;
    color: #D7A859;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .login-panel form,
  .signup-panel form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .login-panel label,
  .signup-panel label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: #2D2D2D;
  }

  .login-panel input,
  .login-panel select,
  .signup-panel input,
  .signup-panel select {
    padding: 10px 12px;
    border: 1px solid #E8D8B5;
    border-radius: 8px;
    background: #FFFFFF;
    font-size: 14px;
    font-weight: 400;
    color: #2D2D2D;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .login-panel input:focus,
  .login-panel select:focus,
  .signup-panel input:focus,
  .signup-panel select:focus {
    border-color: #D7A859;
    box-shadow: 0 0 0 3px rgba(215, 168, 89, 0.25);
  }

  .password-toggle {
    align-self: flex-start;
    margin-top: 4px;
    background: none;
    border: none;
    color: #233A66;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
  }

  .password-toggle:hover {
    text-decoration: underline;
  }

  .login-panel form > button[type='submit'],
  .signup-panel form > button[type='submit'] {
    margin-top: 6px;
    background: linear-gradient(135deg, #233A66 0%, #D7A859 100%);
    color: #FFFFFF;
    border: none;
    padding: 11px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: filter 0.15s ease, transform 0.05s ease;
  }

  .login-panel form > button[type='submit']:hover,
  .signup-panel form > button[type='submit']:hover {
    filter: brightness(0.94);
  }

  .login-panel form > button[type='submit']:active,
  .signup-panel form > button[type='submit']:active {
    transform: translateY(1px);
  }

  .status-message {
    margin-top: 22px;
    background: #F8F3E8;
    border: 1px solid #E8D8B5;
    color: #233A66;
    padding: 12px 18px;
    border-radius: 8px;
    font-size: 14px;
    text-align: center;
    max-width: 920px;
    width: 100%;
  }

  @media (max-width: 700px) {
    .login-panel {
      border-right: none;
      border-bottom: 1px solid #E8D8B5;
    }
  }
`}</style>
      <div className="login-page">
        <h1 className="login-title">Rating System</h1>
        <div className="login-card">
          <section className="login-panel">
            <h2>Sign In</h2>
            <form onSubmit={handleLoginSubmit}>
              <label>
                User Type
                <select
                  value={loginUserType}
                  onChange={(event) => setLoginUserType(event.target.value)}
                >
                  {loginOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {loginUserType === 'System Administrator'
                  ? 'Username'
                  : 'Email'}
                <input
                  type={loginUserType === 'System Administrator' ? 'text' : 'email'}
                  name="loginId"
                  value={loginForm.identifier}
                  onChange={(event) =>
                    setLoginForm({ ...loginForm, identifier: event.target.value })
                  }
                />
              </label>
              <label>
                Password
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  name="loginPassword"
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm({ ...loginForm, password: event.target.value })
                  }
                />
                <button type="button" className="password-toggle" onClick={() => setShowLoginPassword(!showLoginPassword)}>
                  {showLoginPassword ? 'Hide' : 'Show'} password
                </button>
              </label>
              <button type="submit">Login</button>
            </form>
          </section>

          <section className="signup-panel">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignupSubmit}>
              <label>
                User Type
                <select
                  value={signupUserType}
                  onChange={(event) => setSignupUserType(event.target.value)}
                >
                  {loginOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              {renderSignupFields()}

              <button type="submit">Sign Up</button>
            </form>
          </section>
        </div>
        {statusMessage ? <p className="status-message">{statusMessage}</p> : null}
      </div>
    </>
  );
}

export default Login;