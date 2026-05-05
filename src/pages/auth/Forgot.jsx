import { useState } from "react";
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";


const MAROON = "#7B1C1C";
const MAROON_DARK = "#5A1313";
const MAROON_MUTED = "#F9EFEF";


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
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                    <FaCheckCircle style={{ color: "#16A34A", fontSize: 28 }} />
                </div>
                <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800, color: "#1A1A1A" }}>Email Terkirim!</h2>
                <p style={{ margin: "0 0 6px", fontSize: 13, color: "#777" }}>Link reset password telah dikirim ke</p>
                <p style={{ margin: "0 0 28px", fontSize: 14, fontWeight: 700, color: MAROON }}>{email}</p>
                <div style={{ background: "#FAFAFA", borderRadius: 10, padding: "14px 18px", marginBottom: 24, fontSize: 12, color: "#999", textAlign: "left" }}>
                    <strong style={{ color: "#555", display: "block", marginBottom: 6 }}>Tidak menerima email?</strong>
                    Cek folder spam atau junk. Link akan kedaluwarsa dalam 30 menit.
                </div>
                <button onClick={() => setSent(false)}
                    style={{ width: "100%", background: MAROON_MUTED, color: MAROON, border: "none", borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>
                    Kirim Ulang
                </button>
                <Link to="/login" style={{ display: "block", textAlign: "center", fontSize: 13, color: "#AAA", textDecoration: "none" }}>
                    ← Kembali ke halaman login
                </Link>
            </div>
        );
    }


    return (
        <div>
            <div style={{ textAlign: "center", marginBottom: 26 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: MAROON_MUTED, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                    <FaEnvelope style={{ color: MAROON, fontSize: 22 }} />
                </div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1A1A1A" }}>Lupa Password?</h2>
                <p style={{ margin: "8px 0 0", fontSize: 13, color: "#999", lineHeight: 1.6 }}>
                    Masukkan email Anda dan kami akan mengirimkan<br />link untuk mereset password.
                </p>
            </div>


            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 }}>Alamat Email</label>
                    <div style={{ position: "relative" }}>
                        <FaEnvelope style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#CCC", fontSize: 13 }} />
                        <input type="email" placeholder="email@example.com" value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={{ width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 12, paddingBottom: 12, border: "1.5px solid #E5E7EB", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", background: "#FAFAFA" }}
                            onFocus={e => e.target.style.borderColor = MAROON}
                            onBlur={e => e.target.style.borderColor = "#E5E7EB"}
                        />
                    </div>
                </div>


                <button type="submit" disabled={loading}
                    style={{ width: "100%", background: loading ? "#CCC" : MAROON, color: "#fff", border: "none", borderRadius: 10, padding: 13, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s", marginBottom: 16 }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = MAROON_DARK; }}
                    onMouseLeave={e => { if (!loading) e.currentTarget.style.background = MAROON; }}
                >
                    {loading ? "Mengirim..." : "Kirim Link Reset"}
                </button>
            </form>


            <Link to="/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13, color: "#AAA", textDecoration: "none" }}>
                <FaArrowLeft size={11} /> Kembali ke halaman login
            </Link>
        </div>
    );
}

