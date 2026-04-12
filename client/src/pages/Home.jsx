import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div style={styles.page}>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <span style={styles.badge}>🚀 Open Discussion Platform</span>
          <h1 style={styles.heroTitle}>
            Ask Questions.<br />
            Share Knowledge.<br />
            <span style={styles.highlight}>Grow Together.</span>
          </h1>
          <p style={styles.heroSubtitle}>
            DiscussHub is a community-driven platform where you can post your problems,
            get answers, and help others along the way.
          </p>
          <div style={styles.heroBtns}>
            <button style={styles.primaryBtn} onClick={() => navigate('/dashboard')}>
              Browse Discussions
            </button>
            {!user && (
              <button style={styles.outlineBtn} onClick={() => navigate('/signup')}>
                Join for Free
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Why DiscussHub?</h2>
        <div style={styles.featureGrid}>
          {[
            { icon: '💬', title: 'Open Discussions', desc: 'Post any topic and get community insights from real people.' },
            { icon: '🔍', title: 'Find Answers', desc: 'Browse existing discussions and find solutions to your problems.' },
            { icon: '✅', title: 'Mark as Solved', desc: 'Keep track of resolved problems with our solved status feature.' },
            { icon: '🔒', title: 'Secure & Private', desc: 'JWT-based authentication keeps your account safe.' },
          ].map((f, i) => (
            <div key={i} style={styles.featureCard}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section style={styles.cta}>
          <h2 style={styles.ctaTitle}>Ready to start discussing?</h2>
          <p style={styles.ctaText}>Join thousands of people sharing knowledge every day.</p>
          <button style={styles.primaryBtn} onClick={() => navigate('/signup')}>
            Create Free Account
          </button>
        </section>
      )}
    </div>
  )
}

const styles = {
  page: { background: '#f8f9fa', minHeight: '100vh' },
  hero: {
    background: 'linear-gradient(135deg, #111 0%, #1e2a4a 100%)',
    color: 'white',
    padding: '100px 40px',
    textAlign: 'center',
  },
  heroContent: { maxWidth: '700px', margin: '0 auto' },
  badge: {
    display: 'inline-block',
    background: 'rgba(79,128,255,0.2)',
    border: '1px solid rgba(79,128,255,0.4)',
    color: '#8faeff',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    marginBottom: '24px',
  },
  heroTitle: { fontSize: '52px', lineHeight: 1.2, fontWeight: 800, margin: '0 0 20px' },
  highlight: { color: '#4f80ff' },
  heroSubtitle: { fontSize: '18px', color: '#aaa', maxWidth: '560px', margin: '0 auto 36px', lineHeight: 1.7 },
  heroBtns: { display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' },
  primaryBtn: {
    padding: '14px 32px', background: '#4f80ff', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: 'pointer',
  },
  outlineBtn: {
    padding: '14px 32px', background: 'transparent', color: 'white',
    border: '2px solid rgba(255,255,255,0.3)', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: 'pointer',
  },
  features: { padding: '80px 40px', maxWidth: '1100px', margin: '0 auto' },
  sectionTitle: { textAlign: 'center', fontSize: '32px', fontWeight: 700, color: '#111', marginBottom: '48px' },
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' },
  featureCard: {
    background: 'white', padding: '32px 24px', borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center',
  },
  featureIcon: { fontSize: '36px', marginBottom: '16px' },
  featureTitle: { fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '10px' },
  featureDesc: { fontSize: '14px', color: '#666', lineHeight: 1.6 },
  cta: {
    background: '#111', color: 'white',
    padding: '80px 40px', textAlign: 'center',
  },
  ctaTitle: { fontSize: '32px', fontWeight: 700, marginBottom: '12px' },
  ctaText: { color: '#aaa', marginBottom: '32px', fontSize: '16px' },
}

export default Home