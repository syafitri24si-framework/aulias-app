export default function Loading() {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            background: "#0A0C10"
        }}>
            <div style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                border: "3px solid rgba(212, 175, 55, 0.2)",
                borderTopColor: "#D4AF37",
                animation: "spin 0.85s linear infinite",
                marginBottom: 16
            }} />
            <p style={{ color: "#D4AF37", fontSize: 14, fontWeight: 600, letterSpacing: 1 }}>Memuat...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}