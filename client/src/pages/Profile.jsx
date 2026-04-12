import React, { useEffect, useState } from 'react';
import profilePic from '../assets/profilePic.png';
import axiosInstance from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/profile');
        setUserData(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const joinDate = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header Card */}
        <div style={styles.headerCard}>
          <div style={styles.avatarWrapper}>
            <img
              src={userData?.profilePic || profilePic}
              alt='profile'
              style={styles.avatar}
            />
            <div style={styles.onlineDot}></div>
          </div>
          <h1 style={styles.name}>{userData?.fullName || user?.fullName}</h1>
          <p style={styles.email}>{userData?.email || user?.email}</p>
          {joinDate && <p style={styles.joinDate}>📅 Joined {joinDate}</p>}
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statNum}>{userData?.problems?.length || 0}</div>
            <div style={styles.statLabel}>Problems Posted</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNum}>
              {userData?.problems?.filter(p => p.solved).length || 0}
            </div>
            <div style={styles.statLabel}>Solved</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNum}>
              {userData?.problems?.reduce((acc, p) => acc + (p.comments?.length || 0), 0) || 0}
            </div>
            <div style={styles.statLabel}>Comments Received</div>
          </div>
        </div>

        {/* My Problems */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>My Discussions</h2>
          {!userData?.problems?.length ? (
            <div style={styles.empty}>
              <p>You haven't posted any problems yet.</p>
              <a href="/dashboard" style={styles.dashLink}>Go to Dashboard →</a>
            </div>
          ) : (
            <div style={styles.problemList}>
              {userData.problems.map((p) => (
                <div key={p._id} style={styles.problemCard}>
                  <div style={styles.problemHeader}>
                    <span style={styles.subject}>{p.subject}</span>
                    <span style={{
                      ...styles.badge,
                      background: p.solved ? '#dcfce7' : '#fef3c7',
                      color: p.solved ? '#166534' : '#92400e',
                    }}>
                      {p.solved ? '✅ Solved' : '⏳ Open'}
                    </span>
                  </div>
                  <p style={styles.question}>{p.question}</p>
                  <div style={styles.meta}>
                    <span>💬 {p.comments?.length || 0} comments</span>
                    <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { background: '#f8f9fa', minHeight: 'calc(100vh - 64px)', padding: '40px 20px' },
  loadingPage: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' },
  spinner: { width: '40px', height: '40px', border: '4px solid #ccc', borderTop: '4px solid #111', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  container: { maxWidth: '800px', margin: '0 auto' },
  headerCard: {
    background: 'linear-gradient(135deg, #111 0%, #1e2a4a 100%)',
    color: 'white', borderRadius: '16px', padding: '48px 32px',
    textAlign: 'center', marginBottom: '24px',
  },
  avatarWrapper: { position: 'relative', display: 'inline-block', marginBottom: '16px' },
  avatar: { width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '4px solid rgba(255,255,255,0.2)' },
  onlineDot: { position: 'absolute', bottom: 4, right: 4, width: '14px', height: '14px', background: '#22c55e', borderRadius: '50%', border: '2px solid white' },
  name: { fontSize: '28px', fontWeight: 700, margin: '0 0 8px' },
  email: { color: '#aaa', margin: '0 0 8px' },
  joinDate: { color: '#888', fontSize: '14px', margin: 0 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { background: 'white', borderRadius: '12px', padding: '24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  statNum: { fontSize: '32px', fontWeight: 700, color: '#111', marginBottom: '6px' },
  statLabel: { fontSize: '13px', color: '#888' },
  section: { background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  sectionTitle: { fontSize: '20px', fontWeight: 700, color: '#111', marginTop: 0, marginBottom: '20px' },
  empty: { textAlign: 'center', padding: '40px', color: '#888' },
  dashLink: { color: '#4f80ff', fontWeight: 600, textDecoration: 'none' },
  problemList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  problemCard: { border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px' },
  problemHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  subject: { fontWeight: 700, fontSize: '16px', color: '#111' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 },
  question: { color: '#555', fontSize: '14px', margin: '0 0 10px', lineHeight: 1.5 },
  meta: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#999' },
};

export default Profile;