// [COM] LoadingSpinner component - dipercantik dengan efek modern
const PRIMARY = "#5E81F4";

export default function LoadingSpinner({ size = 40, fullScreen = false, text = "Memuat..." }) {
  // Tambahkan style animation ke head jika belum ada
  if (typeof document !== "undefined" && !document.querySelector("#spinner-style")) {
    const style = document.createElement("style");
    style.id = "spinner-style";
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  const spinner = (
    <div style={{ textAlign: "center" }}>
      <div style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `conic-gradient(from 0deg, ${PRIMARY}20, ${PRIMARY}, ${PRIMARY}20)`,
        animation: "spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        marginBottom: size > 30 ? "16px" : "0"
      }} />
      {text && size > 30 && (
        <div style={{ 
          fontSize: "13px", 
          color: PRIMARY, 
          fontWeight: 500,
          animation: "pulse 1.5s ease infinite"
        }}>
          {text}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{ 
        display: "flex", 
        flexDirection: "column",
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh", 
        background: "linear-gradient(135deg, #F6F6F6, #FFFFFF)",
        gap: "16px"
      }}>
        {spinner}
      </div>
    );
  }

  return spinner;
}