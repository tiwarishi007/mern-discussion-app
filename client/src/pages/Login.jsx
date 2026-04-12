import React, { useState } from "react";
import axiosInstance from "../utils/axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>Sign in to your DiscussHub account</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/signup" style={styles.link}>Create one</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "calc(100vh - 64px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)",
    padding: "40px 20px",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
  },
  header: { marginBottom: "32px", textAlign: "center" },
  title: { fontSize: "28px", fontWeight: 700, color: "#111", margin: "0 0 8px" },
  subtitle: { color: "#666", fontSize: "15px", margin: 0 },
  error: {
    background: "#fff0f0", border: "1px solid #fca5a5",
    color: "#dc2626", padding: "12px 16px", borderRadius: "8px",
    marginBottom: "20px", fontSize: "14px",
  },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "14px", fontWeight: 600, color: "#333" },
  input: {
    padding: "12px 14px", borderRadius: "8px", border: "1.5px solid #e5e7eb",
    fontSize: "15px", outline: "none", transition: "border 0.2s",
  },
  btn: {
    padding: "13px", background: "#111", color: "white",
    border: "none", borderRadius: "8px", fontSize: "15px",
    fontWeight: 600, cursor: "pointer", marginTop: "4px",
  },
  footer: { textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#666" },
  link: { color: "#4f80ff", fontWeight: 600, textDecoration: "none" },
};

export default Login;
