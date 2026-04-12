import React, { useState } from "react";
import LeftPart from "../components/LeftPart";
import RightPart from "../components/RightPart";
import axiosInstance from "../utils/axios";

const Dashboard = () => {
  const [selectedProblem, setSelectedProblem] = useState(null);

  const handleSolvedToggle = async (problemId, solved) => {
    try {
      await axiosInstance.patch(`/discussion/solve/${problemId}`, { solved });
      setSelectedProblem((prev) => prev ? { ...prev, solved } : prev);
    } catch (err) {
      console.error("Failed to update solved status", err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <LeftPart
          onSelectProblem={setSelectedProblem}
          selectedId={selectedProblem?._id}
        />
      </div>
      <div style={styles.right}>
        <RightPart problem={selectedProblem} onSolvedToggle={handleSolvedToggle} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "calc(100vh - 64px)",
    overflow: "hidden",
  },
  left: {
    width: "340px",
    flexShrink: 0,
    overflowY: "auto",
    borderRight: "1px solid #333",
  },
  right: {
    flex: 1,
    overflowY: "auto",
    backgroundColor: "#1e1e1e",
  },
};

export default Dashboard;
