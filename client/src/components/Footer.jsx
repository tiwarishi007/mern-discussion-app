import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        
        <h3 style={styles.logo}>DiscussHub</h3>

        <div style={styles.links}>
          <Link style={styles.link} to="/">Home</Link>
          <Link style={styles.link} to="/login">Login</Link>
          <Link style={styles.link} to="/signup">Signup</Link>
          <Link style={styles.link} to="/profile">Profile</Link>
        </div>

        <p style={styles.copy}>
          © {new Date().getFullYear()} DiscussHub. All rights reserved.
        </p>

      </div>
    </footer>
  )
}

const styles = {
  footer: {
    backgroundColor: "#111",
    color: "white",
    padding: "30px 0",
  },
  container: {
    maxWidth: "auto",
    margin: "auto",
    textAlign: "center"
  },
  logo: {
    marginBottom: "10px"
  },
  links: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "10px"
  },
  link: {
    color: "white",
    textDecoration: "none"
  },
  copy: {
    fontSize: "14px",
    opacity: "0.7"
  }
}

export default Footer
