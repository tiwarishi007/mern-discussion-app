import React, { useState } from 'react';
import axiosInstance from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [showDelete, setShowDelete] = useState(false);

  const handlePwChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPwMsg({ type: '', text: '' });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPwMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPwMsg({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    setPwLoading(true);
    try {
      await axiosInstance.put('/profile/update-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPwMsg({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>Settings</h1>

        {/* Account Info */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Account Information</h2>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Name</span>
            <span style={styles.infoValue}>{user?.fullName}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Email</span>
            <span style={styles.infoValue}>{user?.email}</span>
          </div>
        </div>

        {/* Change Password */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Change Password</h2>
          {pwMsg.text && (
            <div style={{ ...styles.msg, background: pwMsg.type === 'error' ? '#fff0f0' : '#f0fdf4', color: pwMsg.type === 'error' ? '#dc2626' : '#166534', border: `1px solid ${pwMsg.type === 'error' ? '#fca5a5' : '#86efac'}` }}>
              {pwMsg.text}
            </div>
          )}
          <form onSubmit={handlePasswordSubmit} style={styles.form}>
            {[
              { name: 'currentPassword', label: 'Current Password' },
              { name: 'newPassword', label: 'New Password' },
              { name: 'confirmPassword', label: 'Confirm New Password' },
            ].map((f) => (
              <div key={f.name} style={styles.field}>
                <label style={styles.label}>{f.label}</label>
                <input
                  type="password"
                  name={f.name}
                  placeholder="••••••••"
                  value={passwordData[f.name]}
                  onChange={handlePwChange}
                  style={styles.input}
                  required
                />
              </div>
            ))}
            <button type="submit" style={{ ...styles.btn, opacity: pwLoading ? 0.7 : 1 }} disabled={pwLoading}>
              {pwLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Session */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Session</h2>
          <p style={styles.sectionDesc}>Sign out of your account on this device.</p>
          <button onClick={handleLogout} style={styles.outlineBtn}>
            Sign Out
          </button>
        </div>

        {/* Danger Zone */}
        <div style={{ ...styles.section, border: '1px solid #fca5a5' }}>
          <h2 style={{ ...styles.sectionTitle, color: '#dc2626' }}>Danger Zone</h2>
          <p style={styles.sectionDesc}>
            Permanently delete your account and all of your data. This action cannot be undone.
          </p>
          {!showDelete ? (
            <button onClick={() => setShowDelete(true)} style={styles.dangerBtn}>
              Delete Account
            </button>
          ) : (
            <div style={styles.deleteConfirmBox}>
              <p style={{ color: '#dc2626', fontWeight: 600, marginTop: 0 }}>
                Type <strong>DELETE</strong> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                style={{ ...styles.input, marginBottom: '12px' }}
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => { setShowDelete(false); setDeleteConfirm(''); }}
                  style={styles.outlineBtn}
                >
                  Cancel
                </button>
                <button
                  disabled={deleteConfirm !== 'DELETE'}
                  style={{ ...styles.dangerBtn, opacity: deleteConfirm !== 'DELETE' ? 0.5 : 1 }}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { background: '#f8f9fa', minHeight: 'calc(100vh - 64px)', padding: '40px 20px' },
  container: { maxWidth: '680px', margin: '0 auto' },
  pageTitle: { fontSize: '28px', fontWeight: 700, color: '#111', marginBottom: '28px' },
  section: { background: 'white', borderRadius: '12px', padding: '28px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  sectionTitle: { fontSize: '18px', fontWeight: 700, color: '#111', marginTop: 0, marginBottom: '16px' },
  sectionDesc: { color: '#666', fontSize: '14px', marginBottom: '16px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f3f4f6' },
  infoLabel: { color: '#888', fontSize: '14px' },
  infoValue: { color: '#111', fontWeight: 500, fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: 600, color: '#333' },
  input: { padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '14px', outline: 'none' },
  btn: { padding: '12px', background: '#111', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  outlineBtn: { padding: '10px 20px', background: 'white', color: '#333', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' },
  dangerBtn: { padding: '10px 20px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  msg: { padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
  deleteConfirmBox: { marginTop: '12px' },
};

export default Settings;
