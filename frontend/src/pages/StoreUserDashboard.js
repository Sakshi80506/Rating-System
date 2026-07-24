import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProfileMenu from '../components/ProfileMenu';

function StoreUserDashboard({ storeUser, onLogout }) {
  const [dashboard, setDashboard] = useState({
    averageRating: 0,
    totalRatings: 0,
    users: [],
  });
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        const response = await api.get(`/api/store/${storeUser.id}/dashboard`);

        if (active) {
          setDashboard(response.data);
          setError('');
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.response?.data?.message || 'Unable to load live store data.');
        }
      }
    };

    loadDashboard();
    const timer = setInterval(loadDashboard, 3000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [storeUser.id]);

  return (
    <>
<style>{`
  .store-dashboard {
    min-height: 100vh;
    background: linear-gradient(180deg, #F8F3E8 0%, #FFFFFF 220px, #FFFFFF 100%);
    color: #2D2D2D;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    padding: 0 0 48px;
  }

  .store-navbar {
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

  .store-navbar h1 {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    color: #233A66;
    letter-spacing: -0.01em;
  }

  .store-navbar p {
    margin: 4px 0 0;
    font-size: 13px;
    color: #D7A859;
  }

  .store-summary {
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

  .rated-users {
    margin: 12px 32px 0;
    background: #FFFFFF;
    border: 1px solid #E8D8B5;
    border-radius: 14px;
    padding: 26px 28px;
    box-shadow: 0 4px 14px rgba(35, 58, 102, 0.08);
  }

  .rated-users h2 {
    margin: 0 0 18px;
    font-size: 19px;
    color: #233A66;
  }

  .rated-users > p {
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
      <main className="store-dashboard">
        <nav className="store-navbar">
          <div>
            <h1>{storeUser.storeName} Dashboard</h1>
            <p>Welcome, {storeUser.ownerName}</p>
          </div>
          <ProfileMenu
            details={{ 'Store name': storeUser.storeName, 'Owner name': storeUser.ownerName, Email: storeUser.email }}
            passwordEndpoint={`/api/store/${storeUser.id}/password`}
            address={storeUser.address}
            addressEndpoint={`/api/store/${storeUser.id}/address`}
            onLogout={onLogout}
          />
        </nav>

        <section className="store-summary" aria-label="Store rating summary">
          <div className="dashboard-card">
            <p>Average store rating</p>
            <h2>{dashboard.averageRating.toFixed(2)} / 5</h2>
          </div>
          <div className="dashboard-card">
            <p>Total submitted ratings</p>
            <h2>{dashboard.totalRatings}</h2>
          </div>
        </section>

        <section className="rated-users">
          <h2>Users who rated your store</h2>
          {dashboard.users.length === 0 ? (
            <p>No ratings have been submitted for this store yet. This list updates automatically.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Average rating</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.averageRating.toFixed(2)} / 5</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {error ? <p className="status-message">{error}</p> : null}
      </main>
    </>
  );
}

export default StoreUserDashboard;