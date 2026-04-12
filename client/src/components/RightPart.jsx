import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axios";
import { useAuth } from "../context/AuthContext";

const RightPart = ({ problem, onSolvedToggle }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  // Reset comments when problem changes
  useEffect(() => {
    if (problem) {
      setComments(problem.comments || []);
      setComment("");
    }
  }, [problem?._id]);

  if (!problem) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>💬</div>
        <h3 style={styles.emptyTitle}>Select a Discussion</h3>
        <p style={styles.emptyText}>Click on any problem from the left panel to view it here.</p>
      </div>
    );
  }

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    if (!user) { alert("Please login to comment"); return; }
    setSubmitting(true);
    try {
      const res = await axiosInstance.post(`/discussion/addComment/${problem._id}`, { text: comment });
      setComments((prev) => [...prev, res.data]);
      setComment("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const postedBy = problem.user?.fullName || "Anonymous";
  const postedAt = problem.createdAt
    ? new Date(problem.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <span style={{
            ...styles.statusBadge,
            background: problem.solved ? '#dcfce7' : '#fef3c7',
            color: problem.solved ? '#166534' : '#92400e',
          }}>
            {problem.solved ? '✅ Solved' : '⏳ Open'}
          </span>
          {onSolvedToggle && (
            <button
              onClick={() => onSolvedToggle(problem._id, !problem.solved)}
              style={styles.solveBtn}
            >
              {problem.solved ? 'Mark as Open' : 'Mark as Solved'}
            </button>
          )}
        </div>
        <h2 style={styles.subject}>{problem.subject}</h2>
        <div style={styles.meta}>
          <span>👤 {postedBy}</span>
          {postedAt && <span>📅 {postedAt}</span>}
        </div>
      </div>

      {/* Question */}
      <div style={styles.questionBox}>
        <p style={styles.question}>{problem.question}</p>
      </div>

      {/* Comments */}
      <div style={styles.commentsSection}>
        <h3 style={styles.commentsTitle}>
          💬 Discussion
          <span style={styles.commentCount}>{comments.length}</span>
        </h3>

        <div style={styles.commentsList}>
          {comments.length === 0 ? (
            <div style={styles.noComments}>
              No comments yet. Be the first to reply!
            </div>
          ) : (
            comments.map((c, i) => (
              <div key={i} style={styles.commentCard}>
                <div style={styles.commentAvatar}>
                  {(c.user?.fullName || 'U')[0].toUpperCase()}
                </div>
                <div style={styles.commentBody}>
                  <div style={styles.commentMeta}>
                    <span style={styles.commentAuthor}>{c.user?.fullName || 'Anonymous'}</span>
                    {c.createdAt && (
                      <span style={styles.commentTime}>
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p style={styles.commentText}>{c.text || c}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        {user ? (
          <div style={styles.inputArea}>
            <div style={styles.inputAvatar}>
              {(user.fullName || 'U')[0].toUpperCase()}
            </div>
            <div style={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Write a comment... (Enter to submit)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={handleKeyDown}
                style={styles.input}
                disabled={submitting}
              />
              <button
                onClick={handleAddComment}
                style={{ ...styles.postBtn, opacity: (!comment.trim() || submitting) ? 0.5 : 1 }}
                disabled={!comment.trim() || submitting}
              >
                {submitting ? '...' : 'Post'}
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.loginPrompt}>
            <a href="/login" style={{ color: '#4f80ff' }}>Login</a> to join the discussion
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '24px', background: '#1e1e1e', color: 'white', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888', textAlign: 'center', padding: '40px' },
  emptyIcon: { fontSize: '48px', marginBottom: '16px' },
  emptyTitle: { fontSize: '20px', fontWeight: 600, color: '#aaa', margin: '0 0 8px' },
  emptyText: { fontSize: '14px', color: '#666', margin: 0 },
  header: { borderBottom: '1px solid #333', paddingBottom: '20px' },
  headerTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 },
  solveBtn: { padding: '7px 14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 },
  subject: { fontSize: '22px', fontWeight: 700, margin: '0 0 10px', color: '#f9fafb' },
  meta: { display: 'flex', gap: '20px', fontSize: '13px', color: '#888' },
  questionBox: { background: '#2a2a2a', borderRadius: '10px', padding: '18px', borderLeft: '3px solid #4f80ff' },
  question: { margin: 0, lineHeight: 1.7, color: '#d1d5db', fontSize: '15px' },
  commentsSection: { flex: 1 },
  commentsTitle: { fontSize: '16px', fontWeight: 600, color: '#f9fafb', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' },
  commentCount: { background: '#333', color: '#aaa', padding: '2px 8px', borderRadius: '12px', fontSize: '13px', fontWeight: 400 },
  commentsList: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' },
  noComments: { color: '#666', fontSize: '14px', textAlign: 'center', padding: '24px', background: '#2a2a2a', borderRadius: '8px' },
  commentCard: { display: 'flex', gap: '12px' },
  commentAvatar: { width: '36px', height: '36px', borderRadius: '50%', background: '#4f80ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '15px', flexShrink: 0 },
  commentBody: { flex: 1, background: '#2a2a2a', borderRadius: '8px', padding: '12px' },
  commentMeta: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
  commentAuthor: { fontWeight: 600, fontSize: '13px', color: '#d1d5db' },
  commentTime: { fontSize: '11px', color: '#666' },
  commentText: { margin: 0, color: '#bbb', fontSize: '14px', lineHeight: 1.5 },
  inputArea: { display: 'flex', gap: '12px', alignItems: 'center' },
  inputAvatar: { width: '36px', height: '36px', borderRadius: '50%', background: '#4f80ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '15px', flexShrink: 0 },
  inputWrapper: { flex: 1, display: 'flex', gap: '8px' },
  input: { flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #444', background: '#2a2a2a', color: 'white', fontSize: '14px', outline: 'none' },
  postBtn: { padding: '10px 18px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' },
  loginPrompt: { textAlign: 'center', color: '#888', fontSize: '14px', padding: '16px', background: '#2a2a2a', borderRadius: '8px' },
};

export default RightPart;