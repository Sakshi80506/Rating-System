import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProfileMenu from '../components/ProfileMenu';

function NormalUserDashboard({ user, onLogout }) {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [ratingValues, setRatingValues] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;

    const loadStores = async () => {
      try {
        const response = await api.get('/api/user/stores', { params: { search, userId: user.id } });
        if (active) {
          setStores(response.data);
        }
      } catch (error) {
        if (active) {
          setMessage(error.response?.data?.message || 'Unable to load stores.');
        }
      }
    };

    loadStores();
    const timer = setInterval(loadStores, 3000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [search, user.id]);

  const handleRatingSubmit = async (storeId) => {
    const rating = Number(ratingValues[storeId]);

    try {
      const response = await api.post(`/api/user/${user.id}/stores/${storeId}/rating`, { rating });
      setMessage(response.data.message);
      setRatingValues((values) => ({ ...values, [storeId]: '' }));
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to save your rating.');
    }
  };

  return (
    <>
<style>{`
  .normal-user-dashboard {
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

  .dashboard-section {
    margin: 28px 32px 0;
    background: #FFFFFF;
    border: 1px solid #E8D8B5;
    border-radius: 14px;
    padding: 26px 28px;
    box-shadow: 0 4px 14px rgba(35, 58, 102, 0.08);
  }

  .dashboard-section > h2 {
    margin: 0 0 18px;
    font-size: 19px;
    color: #233A66;
  }

  .search-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: #2D2D2D;
    max-width: 420px;
    margin-bottom: 24px;
  }

  .search-field input {
    padding: 10px 12px;
    border: 1px solid #E8D8B5;
    border-radius: 8px;
    background: #F8F3E8;
    font-size: 14px;
    font-weight: 400;
    color: #2D2D2D;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .search-field input:focus {
    border-color: #D7A859;
    box-shadow: 0 0 0 3px rgba(215, 168, 89, 0.25);
    background: #FFFFFF;
  }

  .dashboard-section > p {
    color: #2D2D2D;
    font-size: 14px;
  }

  .store-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 18px;
  }

  .store-card {
    background: #F8F3E8;
    border: 1px solid #E8D8B5;
    border-radius: 12px;
    padding: 18px 20px;
    transition: box-shadow 0.15s ease, transform 0.05s ease;
  }

  .store-card:hover {
    box-shadow: 0 6px 18px rgba(35, 58, 102, 0.12);
    transform: translateY(-2px);
  }

  .store-card h3 {
    margin: 0 0 10px;
    font-size: 16px;
    color: #233A66;
  }

  .store-card p {
    margin: 4px 0;
    font-size: 13px;
    color: #2D2D2D;
  }

  .rating-action {
    display: flex;
    gap: 10px;
    margin-top: 14px;
  }

  .rating-action select {
    flex: 1;
    padding: 8px 10px;
    border: 1px solid #E8D8B5;
    border-radius: 8px;
    background: #FFFFFF;
    font-size: 13px;
    color: #2D2D2D;
    outline: none;
  }

  .rating-action select:focus {
    border-color: #D7A859;
    box-shadow: 0 0 0 3px rgba(215, 168, 89, 0.25);
  }

  .rating-action button {
    background: linear-gradient(135deg, #233A66 0%, #D7A859 100%);
    color: #FFFFFF;
    border: none;
    padding: 8px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: filter 0.15s ease;
    white-space: nowrap;
  }

  .rating-action button:hover {
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
      <main className="normal-user-dashboard">
        <nav className="store-navbar">
          <div>
            <h1>Welcome, {user.name}</h1>
            <p>Find registered stores and manage your account.</p>
          </div>
          <ProfileMenu
            details={{ Name: user.name, Email: user.email }}
            passwordEndpoint={`/api/user/${user.id}/password`}
            address={user.address}
            addressEndpoint={`/api/user/${user.id}/address`}
            onLogout={onLogout}
          />
        </nav>

        <section className="dashboard-section">
          <h2>Registered stores</h2>
          <label className="search-field">
            Search by store name or address
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="e.g. Central Market or Main Street"
            />
          </label>

          {stores.length === 0 ? (
            <p>No stores match your search.</p>
          ) : (
            <div className="store-list">
              {stores.map((store) => (
                <article className="store-card" key={store.id}>
                  <h3>{store.storeName}</h3>
                  <p><strong>Address:</strong> {store.address || 'Address not added yet'}</p>
                  <p><strong>Overall rating:</strong> {store.overallRating.toFixed(2)} / 5</p>
                  <p><strong>Your submitted rating:</strong> {store.userRating === null ? 'Not submitted' : `${store.userRating.toFixed(0)} / 5`}</p>
                  <div className="rating-action">
                    <select
                      aria-label={`Rating for ${store.storeName}`}
                      value={ratingValues[store.id] ?? store.userRating ?? ''}
                      onChange={(event) => setRatingValues({ ...ratingValues, [store.id]: event.target.value })}
                    >
                      <option value="">Select 1–5</option>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <option key={rating} value={rating}>{rating}</option>
                      ))}
                    </select>
                    <button type="button" onClick={() => handleRatingSubmit(store.id)}>
                      {store.userRating === null ? 'Submit rating' : 'Modify rating'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {message ? <p className="status-message">{message}</p> : null}
      </main>
    </>
  );
}

export default NormalUserDashboard;