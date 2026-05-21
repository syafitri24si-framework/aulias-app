// [COM] Badge component - dipercantik dengan efek modern
export default function Badge({ children, type = "primary" }) {
  const styles = {
    primary: { bg: "linear-gradient(135deg, #5E81F4, #1B51E5)", color: "#FFF" },
    gold: { bg: "linear-gradient(135deg, #5E81F4, #1B51E5)", color: "#FFF" },
    silver: { bg: "linear-gradient(135deg, #8181A5, #6B6B8D)", color: "#FFF" },
    bronze: { bg: "linear-gradient(135deg, #F4BE5E, #D4A04A)", color: "#FFF" },
    success: { bg: "linear-gradient(135deg, #7CE7AC, #5BCB8A)", color: "#FFF" },
    warning: { bg: "linear-gradient(135deg, #F4BE5E, #E5A63A)", color: "#FFF" },
    danger: { bg: "linear-gradient(135deg, #FF808B, #E55A68)", color: "#FFF" },
    none: { bg: "#F0F2F5", color: "#8181A5" }
  };

  const style = styles[type] || styles.primary;

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      background: style.bg,
      color: style.color,
      padding: "5px 14px",
      borderRadius: "30px",
      fontSize: "12px",
      fontWeight: 600,
      fontFamily: "'Inter', 'Lato', sans-serif",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      letterSpacing: "0.2px"
    }}>
      {children}
    </span>
  );
}