import React, { useState } from 'react';
import api from '../services/api';

function ProfileMenu({ details, passwordEndpoint, address, addressEndpoint, addressLabel = 'Address', onLogout }) {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [storeAddress, setStoreAddress] = useState(address || '');

  const updatePassword = async (event) => {
    event.preventDefault();

    try {
      const response = await api.patch(passwordEndpoint, { currentPassword, newPassword });
      setMessage(response.data.message);
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to update password.');
    }
  };

  const updateAddress = async (event) => {
    event.preventDefault();

    try {
      const response = await api.patch(addressEndpoint, { address: storeAddress });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to update store address.');
    }
  };

  return (
    <div className="profile-menu">
      <button
        type="button"
        className="profile-icon"
        aria-label="Open profile"
        onClick={() => setOpen(!open)}
      >
        👤
      </button>
      {open ? (
        <section className="profile-panel">
          <h2>My profile</h2>
          <dl>
            {Object.entries(details).map(([label, value]) => (
              <React.Fragment key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </React.Fragment>
            ))}
          </dl>
          {addressEndpoint ? (
            <form onSubmit={updateAddress}>
              <label>
                {addressLabel}
                <input
                  type="text"
                  value={storeAddress}
                  onChange={(event) => setStoreAddress(event.target.value)}
                  required
                />
              </label>
              <button type="submit" className="profile-save">Save address</button>
            </form>
          ) : null}
          <form onSubmit={updatePassword}>
            <label>
              Current password
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
              />
            </label>
            <button type="button" className="password-toggle" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
              {showCurrentPassword ? 'Hide' : 'Show'} password
            </button>
            <label>
              New password
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
              />
            </label>
            <button type="button" className="password-toggle" onClick={() => setShowNewPassword(!showNewPassword)}>
              {showNewPassword ? 'Hide' : 'Show'} password
            </button>
            <button type="submit" className="profile-save">Update password</button>
          </form>
          {message ? <p className="profile-message">{message}</p> : null}
          <button type="button" className="profile-logout" onClick={onLogout}>Log out</button>
        </section>
      ) : null}
    </div>
  );
}

export default ProfileMenu;
