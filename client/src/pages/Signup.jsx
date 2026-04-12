import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "", email: "", password: "", confirmPassword: "",
  });
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
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/register", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Create your account</h1>
          <p style={styles.subtitle}>Join DiscussHub and start discussing</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {[
            { name: "fullName", label: "Full Name", type: "text", placeholder: "John Doe" },
            { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
            { name: "password", label: "Password", type: "password", placeholder: "Min 6 characters" },
            { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Repeat password" },
          ].map((f) => (
            <div key={f.name} style={styles.field}>
              <label style={styles.label}>{f.label}</label>
              <input
                type={f.type}
                name={f.name}
                placeholder={f.placeholder}
                value={formData[f.name]}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          ))}

          <button type="submit" style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>Sign in</Link>
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
    maxWidth: "420px",
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
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "14px", fontWeight: 600, color: "#333" },
  input: {
    padding: "12px 14px", borderRadius: "8px", border: "1.5px solid #e5e7eb",
    fontSize: "15px", outline: "none",
  },
  btn: {
    padding: "13px", background: "#111", color: "white",
    border: "none", borderRadius: "8px", fontSize: "15px",
    fontWeight: 600, cursor: "pointer", marginTop: "4px",
  },
  footer: { textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#666" },
  link: { color: "#4f80ff", fontWeight: 600, textDecoration: "none" },
};

export default Signup;
