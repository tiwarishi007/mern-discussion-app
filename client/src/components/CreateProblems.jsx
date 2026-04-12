import React, { useState } from "react";
import axiosInstance from "../utils/axios";
import { useNavigate } from "react-router-dom";

const CreateProblems = ({ onClose, refetchProblems }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: "",
    question: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("/discussion/createProblem", formData);

      // Reset form
      setFormData({ subject: "", question: "" });

      // Call callbacks
      if (onClose) onClose();
      if (refetchProblems) refetchProblems();
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Creation Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.h2}>Tell The World Your Problem</h2>

        <input
          type="text"
          name="subject"
          placeholder="Topic"
          value={formData.subject}
          onChange={handleChange}
          style={styles.input}
          required
          disabled={loading}
        />

        <textarea
          name="question"
          placeholder="Your Question"
          value={formData.question}
          onChange={handleChange}
          style={{ ...styles.input, minHeight: "100px", resize: "vertical" }}
          required
          disabled={loading}
          rows="4"
        />

        <button
          type="submit"
          style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
          disabled={loading}
        >
          {loading ? "Creating..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "20px",
    background: "white",
    borderRadius: "10px",
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    padding: "12px",
    border: "none",
    background: "#111",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  h2: {
    textAlign: "center",
    marginBottom: "10px",
  },
};

export default CreateProblems;
