import { useNavigate } from "react-router-dom";


export default function NotFound({ code = "404", title = "Page Not Found", description = "Halaman tidak ditemukan atau sudah dipindahkan." }) {
    const navigate = useNavigate();
    return (
        <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f9fafb", fontFamily: "Poppins", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", width: "450px", height: "450px", background: "#8B5E3C", borderRadius: "50%", filter: "blur(150px)", opacity: 0.2 }}></div>
            <div style={{ textAlign: "center", zIndex: 2 }}>
                <h1 style={{ fontSize: "120px", fontWeight: "800", color: "#8B5E3C", margin: 0 }}>{code}</h1>
                <h2 style={{ fontSize: "26px", fontWeight: "600", marginTop: "10px" }}>{title}</h2>
                <p style={{ color: "#777", maxWidth: "400px", margin: "15px auto 30px", lineHeight: "1.6" }}>{description}</p>
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    <button style={{ background: "#8B5E3C", color: "white", border: "none", padding: "10px 18px", borderRadius: "8px", cursor: "pointer" }} onClick={() => navigate("/")}>Dashboard</button>
                    <button style={{ background: "transparent", border: "2px solid #8B5E3C", color: "#8B5E3C", padding: "10px 18px", borderRadius: "8px", cursor: "pointer" }} onClick={() => navigate(-1)}>Back</button>
                </div>
            </div>
        </div>
    );
}

