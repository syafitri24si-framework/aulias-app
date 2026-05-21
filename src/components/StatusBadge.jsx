// [COM] StatusBadge component - dipercantik dengan efek dot berdenyut
export default function StatusBadge({ status }) {
  const statusStyle = {
    Completed: { 
      bg: "rgba(124, 231, 172, 0.12)", 
      color: "#2E7D32",
      dot: "#4CAF50"
    },
    Pending: { 
      bg: "rgba(244, 190, 94, 0.12)", 
      color: "#E6A017",
      dot: "#F4BE5E"
    },
    Cancelled: { 
      bg: "rgba(255, 128, 139, 0.12)", 
      color: "#C62828",
      dot: "#FF808B"
    }
  };

  const s = statusStyle[status] || statusStyle.Pending;

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      background: s.bg,
      color: s.color,
      padding: "6px 14px",
      borderRadius: "30px",
      fontSize: "12px",
      fontWeight: 600,
      fontFamily: "'Inter', 'Lato', sans-serif"
    }}>
      <span style={{ 
        width: "8px", 
        height: "8px", 
        borderRadius: "50%", 
        background: s.dot,
        animation: status === "Pending" ? "pulse 1.5s ease infinite" : "none",
        boxShadow: `0 0 6px ${s.dot}`
      }} />
      {status}
    </span>
  );
}