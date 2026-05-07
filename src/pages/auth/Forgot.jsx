import { useState } from "react";
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const PRIMARY = "#5E81F4";
const PRIMARY_DARK = "#1B51E5";

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
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(124, 231, 172, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                    <FaCheckCircle style={{ color: "#7CE7AC", fontSize: 28 }} />
                </div>
                <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800, color: "#1A1A1A" }}>Email Terkirim!</h2>
                <p style={{ margin: "0 0 6px", fontSize: 13, color: "#8181A5" }}>Link reset password telah dikirim ke</p>
                <p style={{ margin: "0 0 28px", fontSize: 14, fontWeight: 700, color: PRIMARY }}>{email}</p>
                <div style={{ background: "#F5F5FA", borderRadius: 12, padding: "14px 18px", marginBottom: 24, fontSize: 12, color: "#8181A5", textAlign: "left" }}>
                    <strong style={{ color: PRIMARY, display: "block", marginBottom: 6 }}>Tidak menerima email?</strong>
                    Cek folder spam atau junk. Link akan kedaluwarsa dalam 30 menit.
                </div>
                <button onClick={() => setSent(false)}
                    style={{ width: "100%", background: "rgba(94, 129, 244, 0.1)", color: PRIMARY, border: "none", borderRadius: 12, padding: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>
                    Kirim Ulang
                </button>
                <Link to="/login" style={{ display: "block", textAlign: "center", fontSize: 13, color: "#8181A5", textDecoration: "none" }}>
                    ← Kembali ke halaman login
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div style={{ textAlign: "center", marginBottom: 26 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(94, 129, 244, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                    <FaEnvelope style={{ color: PRIMARY, fontSize: 22 }} />
                </div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1A1A1A" }}>Lupa Password?</h2>
                <p style={{ margin: "8px 0 0", fontSize: 13, color: "#8181A5", lineHeight: 1.6 }}>
                    Masukkan email Anda dan kami akan mengirimkan<br />link untuk mereset password.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#464A5F", display: "block", marginBottom: 6 }}>Alamat Email</label>
                    <div style={{ position: "relative" }}>
                        <FaEnvelope style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#AAABB0", fontSize: 13 }} />
                        <input 
                            type="email" 
                            placeholder="email@example.com" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                paddingLeft: 36,
                                paddingRight: 14,
                                paddingTop: 12,
                                paddingBottom: 12,
                                border: "1px solid #ECECF2",
                                borderRadius: 12,
                                fontSize: 14,
                                outline: "none",
                                boxSizing: "border-box",
                                background: "#FFFFFF",
                                color: "#464A5F",
                                fontFamily: "'Lato', sans-serif"
                            }}
                            onFocus={e => e.target.style.borderColor = PRIMARY}
                            onBlur={e => e.target.style.borderColor = "#ECECF2"}
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{
                        width: "100%",
                        background: loading ? "#AAABB0" : PRIMARY,
                        color: "#FFF",
                        border: "none",
                        borderRadius: 12,
                        padding: 13,
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "all 0.2s",
                        marginBottom: 16
                    }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = PRIMARY_DARK; }}
                    onMouseLeave={e => { if (!loading) e.currentTarget.style.background = PRIMARY; }}
                >
                    {loading ? "Mengirim..." : "Kirim Link Reset"}
                </button>
            </form>

            <Link to="/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13, color: "#8181A5", textDecoration: "none" }}>
                <FaArrowLeft size={11} /> Kembali ke halaman login
            </Link>
        </div>
    );
}