import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../utils/axios";
import CreateProblems from "./CreateProblems";
import { useAuth } from "../context/AuthContext";

const LeftPart = ({ onSelectProblem, selectedId }) => {
  const [showForm, setShowForm] = useState(false);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | open | solved
  const { user } = useAuth();

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/discussion/getProblem");
      setProblems(res.data.data || res.data || []);
    } catch (err) {
      console.error("Fetch problems error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const handleCreateClose = () => {
    setShowForm(false);
    fetchProblems();
  };

  const handleDelete = async (e, problemId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this problem?")) return;
    try {
      await axiosInstance.delete(`/discussion/delete/${problemId}`);
      setProblems((prev) => prev.filter((p) => p._id !== problemId));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const filtered = problems.filter((p) => {
    const matchSearch =
      p.subject.toLowerCase().includes(search.toLowerCase()) ||
      p.question.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "solved" && p.solved) ||
      (filter === "open" && !p.solved);
    return matchSearch && matchFilter;
  });

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>Discussions</h3>
        {user && (
          <button
            style={styles.addBtn}
            onClick={() => setShowForm(!showForm)}
            disabled={loading}
          >
            {showForm ? "✕ Cancel" : "+ New"}
          </button>
        )}
      </div>

      {/* Search */}
      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="🔍 Search discussions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Filter tabs */}
      <div style={styles.tabs}>
        {["all", "open", "solved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...styles.tab,
              ...(filter === f ? styles.activeTab : {}),
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Create Form */}
      {showForm && (
        <CreateProblems
          onClose={handleCreateClose}
          refetchProblems={fetchProblems}
        />
      )}

      {/* Problems List */}
      <div style={styles.list}>
        {loading ? (
          <div style={styles.center}>
            <div style={styles.spinner}></div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            {search ? "No results found." : "No discussions yet. Create one!"}
          </div>
        ) : (
          filtered.map((p) => (
            <div
              key={p._id}
              onClick={() => onSelectProblem?.(p)}
              style={{
                ...styles.card,
                ...(selectedId === p._id ? styles.selectedCard : {}),
              }}
            >
              <div style={styles.cardHeader}>
                <span style={styles.subject}>{p.subject}</span>
                <div style={styles.cardActions}>
                  <span style={{
                    ...styles.badge,
                    background: p.solved ? '#dcfce7' : '#fef3c7',
                    color: p.solved ? '#166534' : '#92400e',
                  }}>
                    {p.solved ? '✅' : '⏳'}
                  </span>
                  {user && p.user?._id === user.id && (
                    <button
                      style={styles.deleteBtn}
                      onClick={(e) => handleDelete(e, p._id)}
                      title="Delete"
                    >
                      🗑
                    </button>
                  )}
                </div>
              </div>
              <p style={styles.question}>
                {p.question.length > 80 ? p.question.slice(0, 80) + "..." : p.question}
              </p>
              <div style={styles.cardFooter}>
                <span style={styles.author}>👤 {p.user?.fullName || "Anonymous"}</span>
                <span style={styles.commentCount}>💬 {p.comments?.length || 0}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    borderBottom: "1px solid #2a2a2a",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    color: "#f9fafb",
  },
  addBtn: {
    padding: "6px 14px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
  },
  searchBox: {
    padding: "12px 16px",
    borderBottom: "1px solid #2a2a2a",
  },
  searchInput: {
    width: "100%",
    padding: "8px 12px",
    background: "#2a2a2a",
    border: "1px solid #333",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
  },
  tabs: {
    display: "flex",
    gap: "0",
    padding: "8px 16px",
    borderBottom: "1px solid #2a2a2a",
  },
  tab: {
    flex: 1,
    padding: "6px",
    background: "transparent",
    color: "#888",
    border: "1px solid #333",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 500,
  },
  activeTab: {
    background: "#2563eb",
    color: "white",
    border: "1px solid #2563eb",
  },
  list: {
    flex: 1,
    overflowY: "auto",
    padding: "8px",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    padding: "40px",
  },
  spinner: {
    width: "28px",
    height: "28px",
    border: "3px solid #444",
    borderTop: "3px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  empty: {
    textAlign: "center",
    color: "#666",
    fontSize: "14px",
    padding: "40px 16px",
    fontStyle: "italic",
  },
  card: {
    background: "#242424",
    padding: "14px",
    marginBottom: "8px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "1px solid transparent",
    transition: "border 0.15s, background 0.15s",
  },
  selectedCard: {
    border: "1px solid #2563eb",
    background: "#1a2540",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "6px",
    gap: "8px",
  },
  subject: {
    fontWeight: 700,
    fontSize: "14px",
    color: "#f9fafb",
    flex: 1,
  },
  cardActions: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flexShrink: 0,
  },
  badge: {
    fontSize: "12px",
    padding: "2px 6px",
    borderRadius: "10px",
  },
  deleteBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    padding: "2px",
    opacity: 0.6,
  },
  question: {
    color: "#aaa",
    fontSize: "13px",
    margin: "0 0 8px",
    lineHeight: 1.4,
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    color: "#666",
  },
  author: {},
  commentCount: {},
};

export default LeftPart;
