import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.loader}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

const styles = {
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #ccc",
    borderTop: "4px solid #111",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

export default PrivateRoute;