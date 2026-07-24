import './App.css';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StoreUserDashboard from './pages/StoreUserDashboard';
import NormalUserDashboard from './pages/NormalUserDashboard';
import { useState } from 'react';

function App() {
  const [activePage, setActivePage] = useState('login');
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = (userType, user) => {
    if (userType === 'System Administrator') {
      setLoggedInUser(user);
      setActivePage('admin-dashboard');
    }

    if (userType === 'Store Owner') {
      setLoggedInUser(user);
      setActivePage('store-dashboard');
    }

    if (userType === 'Normal User') {
      setLoggedInUser(user);
      setActivePage('normal-user-dashboard');
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setActivePage('login');
  };

  if (activePage === 'admin-dashboard') {
    return <AdminDashboard admin={loggedInUser} onLogout={handleLogout} />;
  }

  if (activePage === 'store-dashboard' && loggedInUser) {
    return <StoreUserDashboard storeUser={loggedInUser} onLogout={handleLogout} />;
  }

  if (activePage === 'normal-user-dashboard' && loggedInUser) {
    return <NormalUserDashboard user={loggedInUser} onLogout={handleLogout} />;
  }

  return <Login onLogin={handleLogin} />;
}

export default App;
