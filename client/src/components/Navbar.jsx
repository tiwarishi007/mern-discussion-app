import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'
import axiosInstance from "../utils/axios";
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      logout();
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logoContainer}>
        <img src={logo} alt="DiscussHub Logo" style={styles.logoImg} />
        <h2 style={styles.logoText}>DiscussHub</h2>
      </Link>

      <div style={styles.links}>
        <Link style={{ ...styles.link, ...(isActive('/') ? styles.activeLink : {}) }} to="/">Home</Link>
        <Link style={{ ...styles.link, ...(isActive('/dashboard') ? styles.activeLink : {}) }} to="/dashboard">Dashboard</Link>

        {user ? (
          <>
            <Link style={{ ...styles.link, ...(isActive('/profile') ? styles.activeLink : {}) }} to="/profile">Profile</Link>
            <Link style={{ ...styles.link, ...(isActive('/settings') ? styles.activeLink : {}) }} to="/settings">Settings</Link>
            <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link style={{ ...styles.link, ...(isActive('/login') ? styles.activeLink : {}) }} to="/login">Login</Link>
            <Link style={styles.signupBtn} to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    height: "64px",
    backgroundColor: "#111",
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    color: "white",
  },
  logoImg: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
  },
  logoText: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 700,
    letterSpacing: "0.5px",
  },
  links: {
    display: "flex",
    gap: "24px",
    alignItems: "center",
  },
  link: {
    color: "#ccc",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: 500,
    transition: "color 0.2s",
    padding: "4px 0",
  },
  activeLink: {
    color: "#fff",
    borderBottom: "2px solid #4f80ff",
    paddingBottom: "2px",
  },
  logoutBtn: {
    padding: "7px 18px",
    border: "1px solid #555",
    background: "transparent",
    color: "#ccc",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    transition: "all 0.2s",
  },
  signupBtn: {
    padding: "7px 18px",
    background: "#4f80ff",
    color: "white",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 600,
  },
};

export default Navbar
