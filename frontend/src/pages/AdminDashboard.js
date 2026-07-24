import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProfileMenu from '../components/ProfileMenu';

function AdminDashboard({ admin, onLogout }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [showUserForm, setShowUserForm] = useState(false);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [listings, setListings] = useState({ stores: [], users: [] });
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    let active = true;

    const loadStats = async () => {
      try {
        const response = await api.get('/api/admin/stats');

        if (active) {
          setStats(response.data);
        }
      } catch (error) {
        if (active) {
          setStats({
            totalUsers: 0,
            totalStores: 0,
            totalRatings: 0,
          });
        }
      }
    };

    loadStats();
    const timer = setInterval(loadStats, 3000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadListings = async () => {
      try {
        const response = await api.get('/api/admin/listings', { params: filters });
        if (active) {
          setListings(response.data);
        }
      } catch (error) {
        if (active) {
          setListings({ stores: [], users: [] });
        }
      }
    };

    loadListings();
    const timer = setInterval(loadListings, 3000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [filters]);

  const handleUserSubmit = async (event) => {
    event.preventDefault();

    try {
      await api.post('/api/user/signup', userForm);

      setMessage('User added successfully.');
      setUserForm({
        name: '',
        email: '',
        address: '',
        password: '',
      });
      setShowUserForm(false);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add user.');
    }
  };

  const dashboardItems = [
    {
      label: 'Total number of users',
      value: stats.totalUsers,
    },
    {
      label: 'Total number of stores',
      value: stats.totalStores,
    },
    {
      label: 'Total number of submitted ratings',
      value: stats.totalRatings,
    },
  ];

  return (
    <>
<style>{`
  .admin-dashboard {
    min-height: 100vh;
    background: linear-gradient(180deg, #F8F3E8 0%, #FFFFFF 220px, #FFFFFF 100%);
    color: #2D2D2D;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    padding: 0 0 48px;
  }

  .admin-navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    background: #FFFFFF;
    border-bottom: 1px solid #E8D8B5;
    padding: 20px 32px;
    box-shadow: 0 2px 10px rgba(35, 58, 102, 0.08);
  }

  .admin-navbar h1 {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    color: #233A66;
    letter-spacing: -0.01em;
  }

  .admin-navbar p {
    margin: 4px 0 0;
    font-size: 13px;
    color: #D7A859;
  }

  .navbar-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .navbar-actions > button {
    background: linear-gradient(135deg, #233A66 0%, #D7A859 100%);
    color: #FFFFFF;
    border: none;
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: filter 0.15s ease, transform 0.05s ease;
  }

  .navbar-actions > button:hover {
    filter: brightness(0.94);
  }

  .navbar-actions > button:active {
    transform: translateY(1px);
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 18px;
    padding: 28px 32px 8px;
  }

  .dashboard-card {
    background: #FFFFFF;
    border: 1px solid #E8D8B5;
    border-radius: 12px;
    padding: 20px 22px;
    box-shadow: 0 4px 14px rgba(35, 58, 102, 0.10);
  }

  .dashboard-card p {
    margin: 0 0 8px;
    font-size: 13px;
    font-weight: 600;
    color: #D7A859;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .dashboard-card h2 {
    margin: 0;
    font-size: 30px;
    font-weight: 700;
    color: #233A66;
  }

  .admin-listings {
    margin: 12px 32px 0;
    background: #FFFFFF;
    border: 1px solid #E8D8B5;
    border-radius: 14px;
    padding: 26px 28px;
    box-shadow: 0 4px 14px rgba(35, 58, 102, 0.08);
  }

  .admin-listings > h2 {
    margin: 0 0 18px;
    font-size: 19px;
    color: #233A66;
  }

  .listing-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 22px;
  }

  .listing-filters input,
  .listing-filters select {
    flex: 1 1 180px;
    padding: 10px 12px;
    border: 1px solid #E8D8B5;
    border-radius: 8px;
    background: #F8F3E8;
    font-size: 14px;
    color: #2D2D2D;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .listing-filters input:focus,
  .listing-filters select:focus {
    border-color: #D7A859;
    box-shadow: 0 0 0 3px rgba(215, 168, 89, 0.25);
    background: #FFFFFF;
  }

  .listing-section {
    margin-bottom: 26px;
  }

  .listing-section h3 {
    margin: 0 0 12px;
    font-size: 15px;
    font-weight: 700;
    color: #D7A859;
  }

  .listing-section p {
    color: #2D2D2D;
    font-size: 14px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  thead tr {
    background: #F8F3E8;
  }

  th {
    text-align: left;
    padding: 10px 12px;
    font-weight: 700;
    color: #233A66;
    border-bottom: 1px solid #E8D8B5;
  }

  td {
    padding: 10px 12px;
    border-bottom: 1px solid #E8D8B5;
    color: #2D2D2D;
  }

  tbody tr:hover {
    background: #F8F3E8;
  }

  .listing-section button,
  .user-details button {
    background: #F8F3E8;
    color: #233A66;
    border: 1px solid #E8D8B5;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .listing-section button:hover,
  .user-details button:hover {
    background: #E8D8B5;
  }

  .user-details {
    margin-top: 18px;
    background: #F8F3E8;
    border: 1px solid #E8D8B5;
    border-radius: 10px;
    padding: 18px 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 18px;
    flex-wrap: wrap;
  }

  .user-details h3 {
    margin: 0 0 10px;
    color: #233A66;
    font-size: 16px;
  }

  .user-details p {
    margin: 4px 0;
    font-size: 14px;
    color: #2D2D2D;
  }

  .user-form-card {
    margin: 22px 32px 0;
    background: #FFFFFF;
    border: 1px solid #E8D8B5;
    border-radius: 14px;
    padding: 26px 28px;
    box-shadow: 0 4px 14px rgba(35, 58, 102, 0.08);
  }

  .user-form-card h2 {
    margin: 0 0 18px;
    font-size: 19px;
    color: #233A66;
  }

  .user-form-card form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 420px;
  }

  .user-form-card label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: #2D2D2D;
  }

  .user-form-card input {
    padding: 10px 12px;
    border: 1px solid #E8D8B5;
    border-radius: 8px;
    background: #F8F3E8;
    font-size: 14px;
    color: #2D2D2D;
    font-weight: 400;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .user-form-card input:focus {
    border-color: #D7A859;
    box-shadow: 0 0 0 3px rgba(215, 168, 89, 0.25);
    background: #FFFFFF;
  }

  .password-toggle {
    align-self: flex-start;
    margin-top: 6px;
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

  .user-form-card > form > button[type='submit'] {
    margin-top: 4px;
    background: linear-gradient(135deg, #233A66 0%, #D7A859 100%);
    color: #FFFFFF;
    border: none;
    padding: 11px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    align-self: flex-start;
    transition: filter 0.15s ease;
  }

  .user-form-card > form > button[type='submit']:hover {
    filter: brightness(0.94);
  }

  .status-message {
    margin: 20px 32px 0;
    background: #F8F3E8;
    border: 1px solid #E8D8B5;
    color: #233A66;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
  }
`}</style>
      <div className="admin-dashboard">
        <nav className="admin-navbar">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage users and monitor live counts</p>
          </div>
          <div className="navbar-actions">
            <button type="button" onClick={() => setShowUserForm((value) => !value)}>
              {showUserForm ? 'Close User Form' : 'Add New User'}
            </button>
            {admin ? <ProfileMenu details={{ Username: admin.username, Email: admin.email }} passwordEndpoint={`/api/admin/${admin.id}/password`} onLogout={onLogout} /> : null}
          </div>
        </nav>

        <div className="dashboard-grid">
          {dashboardItems.map((item) => (
            <div key={item.label} className="dashboard-card">
              <p>{item.label}</p>
              <h2>{item.value}</h2>
            </div>
          ))}
        </div>

        <section className="admin-listings">
          <h2>Directory</h2>
          <div className="listing-filters">
            <input
              type="search"
              value={filters.name}
              onChange={(event) => setFilters({ ...filters, name: event.target.value })}
              placeholder="Filter by name"
            />
            <input
              type="search"
              value={filters.email}
              onChange={(event) => setFilters({ ...filters, email: event.target.value })}
              placeholder="Filter by email"
            />
            <input
              type="search"
              value={filters.address}
              onChange={(event) => setFilters({ ...filters, address: event.target.value })}
              placeholder="Filter by address"
            />
            <select
              value={filters.role}
              onChange={(event) => setFilters({ ...filters, role: event.target.value })}
            >
              <option value="">All roles</option>
              <option value="Normal User">Normal User</option>
              <option value="Store Owner">Store Owner</option>
            </select>
          </div>

          <div className="listing-section">
            <h3>Registered stores</h3>
            {listings.stores.length === 0 ? <p>No stores match these filters.</p> : (
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Rating</th></tr></thead>
                <tbody>{listings.stores.map((store) => (
                  <tr key={store.id}>
                    <td>{store.name}</td><td>{store.email}</td><td>{store.address || 'Not added'}</td><td>{store.rating.toFixed(2)} / 5</td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </div>

          <div className="listing-section">
            <h3>All users</h3>
            {listings.users.length === 0 ? <p>No users match these filters.</p> : (
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Role</th><th>Details</th></tr></thead>
                <tbody>{listings.users.map((user) => (
                  <tr key={`${user.role}-${user.id}`}>
                    <td>{user.name}</td><td>{user.email}</td><td>{user.address || 'Not added'}</td><td>{user.role}</td>
                    <td><button type="button" onClick={() => setSelectedUser(user)}>View details</button></td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </div>

          {selectedUser ? (
            <section className="user-details">
              <div>
                <h3>User details</h3>
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Address:</strong> {selectedUser.address || 'Not added'}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
                {selectedUser.role === 'Store Owner' ? <p><strong>Rating:</strong> {selectedUser.rating.toFixed(2)} / 5</p> : null}
              </div>
              <button type="button" onClick={() => setSelectedUser(null)}>Close</button>
            </section>
          ) : null}
        </section>

        {showUserForm ? (
          <div className="user-form-card">
            <h2>Add New User</h2>
            <form onSubmit={handleUserSubmit}>
              <label>
                Name
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(event) => setUserForm({ ...userForm, name: event.target.value })}
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(event) => setUserForm({ ...userForm, email: event.target.value })}
                />
              </label>
              <label>
                Address
                <input
                  type="text"
                  value={userForm.address}
                  onChange={(event) => setUserForm({ ...userForm, address: event.target.value })}
                />
              </label>
              <label>
                Password
                <input
                  type={showUserPassword ? 'text' : 'password'}
                  value={userForm.password}
                  onChange={(event) => setUserForm({ ...userForm, password: event.target.value })}
                />
                <button type="button" className="password-toggle" onClick={() => setShowUserPassword(!showUserPassword)}>
                  {showUserPassword ? 'Hide' : 'Show'} password
                </button>
              </label>
              <button type="submit">Save User</button>
            </form>
          </div>
        ) : null}

        {message ? <p className="status-message">{message}</p> : null}
      </div>
    </>
  );
}

export default AdminDashboard;