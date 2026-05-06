import { useState } from "react";
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const GOLD = "#D4AF37";
const GOLD_DARK = "#B8942E";

export default function Forgot() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        setTimeout(() => { setLoading(false); setSent(true); }, 1200);
    };

    if (sent) {
        return (
            <div style={{ textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(74, 222, 128, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                    <FaCheckCircle style={{ color: "#4ADE80", fontSize: 28 }} />
                </div>
                <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800, color: "#F3F4F6" }}>Email Terkirim!</h2>
                <p style={{ margin: "0 0 6px", fontSize: 13, color: "#9CA3AF" }}>Link reset password telah dikirim ke</p>
                <p style={{ margin: "0 0 28px", fontSize: 14, fontWeight: 700, color: GOLD }}>{email}</p>
                <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "14px 18px", marginBottom: 24, fontSize: 12, color: "#9CA3AF", textAlign: "left" }}>
                    <strong style={{ color: "#D4AF37", display: "block", marginBottom: 6 }}>Tidak menerima email?</strong>
                    Cek folder spam atau junk. Link akan kedaluwarsa dalam 30 menit.
                </div>
                <button onClick={() => setSent(false)}
                    style={{ width: "100%", background: "rgba(212, 175, 55, 0.15)", color: GOLD, border: "none", borderRadius: 12, padding: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>
                    Kirim Ulang
                </button>
                <Link to="/login" style={{ display: "block", textAlign: "center", fontSize: 13, color: "#9CA3AF", textDecoration: "none" }}>
                    ← Kembali ke halaman login
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div style={{ textAlign: "center", marginBottom: 26 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(212, 175, 55, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                    <FaEnvelope style={{ color: GOLD, fontSize: 22 }} />
                </div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#F3F4F6" }}>Lupa Password?</h2>
                <p style={{ margin: "8px 0 0", fontSize: 13, color: "#9CA3AF", lineHeight: 1.6 }}>
                    Masukkan email Anda dan kami akan mengirimkan<br />link untuk mereset password.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#D4AF37", display: "block", marginBottom: 6 }}>Alamat Email</label>
                    <div style={{ position: "relative" }}>
                        <FaEnvelope style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: 13 }} />
                        <input type="email" placeholder="email@example.com" value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={{ width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 12, paddingBottom: 12, border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box", background: "rgba(0,0,0,0.3)", color: "#F3F4F6" }}
                            onFocus={e => e.target.style.borderColor = GOLD}
                            onBlur={e => e.target.style.borderColor = "rgba(212, 175, 55, 0.3)"}
                        />
                    </div>
                </div>

                <button type="submit" disabled={loading}
                    style={{ width: "100%", background: loading ? "#6B7280" : "linear-gradient(135deg, #D4AF37, #B8942E)", color: "#000", border: "none", borderRadius: 12, padding: 13, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s", marginBottom: 16 }}
                >
                    {loading ? "Mengirim..." : "Kirim Link Reset"}
                </button>
            </form>

            <Link to="/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13, color: "#9CA3AF", textDecoration: "none" }}>
                <FaArrowLeft size={11} /> Kembali ke halaman login
            </Link>
        </div>
    );
}