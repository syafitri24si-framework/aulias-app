import { useNavigate } from "react-router-dom";
import logoRotte from "../assets/logo_rotte.png";

const GOLD = "#D4AF37";

export default function NotFound({ code = "404", title = "Page Not Found", description = "Halaman tidak ditemukan atau sudah dipindahkan." }) {
    const navigate = useNavigate();
    return (
        <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#0A0C10", fontFamily: "Inter, sans-serif", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", width: "450px", height: "450px", background: GOLD, borderRadius: "50%", filter: "blur(150px)", opacity: 0.1 }}></div>
            <div style={{ textAlign: "center", zIndex: 2 }}>
                <h1 style={{ fontSize: "120px", fontWeight: "800", color: GOLD, margin: 0 }}>{code}</h1>
                <h2 style={{ fontSize: "26px", fontWeight: "600", marginTop: "10px", color: "#F3F4F6" }}>{title}</h2>
                <p style={{ color: "#9CA3AF", maxWidth: "400px", margin: "15px auto 30px", lineHeight: "1.6" }}>{description}</p>
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    <button style={{ background: `linear-gradient(135deg, ${GOLD}, #B8942E)`, color: "#000", border: "none", padding: "10px 18px", borderRadius: 10, cursor: "pointer", fontWeight: 600 }} onClick={() => navigate("/")}>Dashboard</button>
                    <button style={{ background: "transparent", border: `2px solid ${GOLD}`, color: GOLD, padding: "10px 18px", borderRadius: 10, cursor: "pointer", fontWeight: 600 }} onClick={() => navigate(-1)}>Back</button>
                </div>
            </div>
        </div>
    );
}