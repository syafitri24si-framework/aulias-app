import axios from "axios";
import { useState } from "react";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

const GOLD = "#D4AF37";
const GOLD_DARK = "#B8942E";

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [dataForm, setDataForm] = useState({ username: "", password: "" });

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setDataForm({ ...dataForm, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!dataForm.username || !dataForm.password) {
            setError("Username dan password wajib diisi");
            return;
        }
        
        setLoading(true);
        setError("");
        
        // ✅ PAKAI ENDPOINT YANG BENAR
      axios.post("https://dummyjson.com/auth/login", {
    username: dataForm.username,
    password: dataForm.password,
})
        .then((response) => {
            if (response.status === 200) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data));
                navigate("/");
            }
        })
        .catch((err) => {
            console.error("Login error:", err);
            if (err.response) {
                setError(err.response.data.message || "Username atau password salah");
            } else if (err.request) {
                setError("Tidak dapat terhubung ke server. Cek koneksi internet Anda.");
            } else {
                setError(err.message || "Terjadi kesalahan");
            }
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const errorInfo = error ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(248, 113, 113, 0.15)", border: "1px solid rgba(248, 113, 113, 0.3)", borderRadius: 10, padding: "11px 14px", marginBottom: 18, fontSize: 13, color: "#F87171" }}>
            <BsFillExclamationDiamondFill /> {error}
        </div>
    ) : null;

    const loadingInfo = loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(212, 175, 55, 0.1)", borderRadius: 10, padding: "11px 14px", marginBottom: 18, fontSize: 13, color: GOLD }}>
            <ImSpinner2 style={{ animation: "spin 1s linear infinite" }} /> Mohon tunggu...
        </div>
    ) : null;

    return (
        <div>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                    <span style={{ fontSize: 26 }}>🥐</span>
                </div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#F3F4F6" }}>Selamat Datang Kembali</h2>
                <p style={{ margin: "6px 0 0", fontSize: 13, color: GOLD }}>Masuk ke dashboard Rotte Bakery CRM</p>
            </div>

            {errorInfo}
            {loadingInfo}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: GOLD, display: "block", marginBottom: 6 }}>Username</label>
                    <div style={{ position: "relative" }}>
                        <FaUser style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: 13 }} />
                        <input 
                            type="text" 
                            name="username" 
                            value={dataForm.username} 
                            onChange={handleChange}
                            placeholder="Masukkan username"
                            style={{ width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 11, paddingBottom: 11, border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border 0.2s", background: "rgba(0,0,0,0.3)", color: "#F3F4F6" }}
                            onFocus={e => e.target.style.borderColor = GOLD}
                            onBlur={e => e.target.style.borderColor = "rgba(212, 175, 55, 0.3)"}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: GOLD, display: "block", marginBottom: 6 }}>Password</label>
                    <div style={{ position: "relative" }}>
                        <FaLock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: 13 }} />
                        <input 
                            type={showPass ? "text" : "password"} 
                            name="password" 
                            value={dataForm.password} 
                            onChange={handleChange}
                            placeholder="Masukkan password"
                            style={{ width: "100%", paddingLeft: 36, paddingRight: 40, paddingTop: 11, paddingBottom: 11, border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border 0.2s", background: "rgba(0,0,0,0.3)", color: "#F3F4F6" }}
                            onFocus={e => e.target.style.borderColor = GOLD}
                            onBlur={e => e.target.style.borderColor = "rgba(212, 175, 55, 0.3)"}
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPass(!showPass)}
                            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex" }}>
                            {showPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                        </button>
                    </div>
                </div>

                <div style={{ textAlign: "right", marginBottom: 20 }}>
                    <Link to="/forgot" style={{ fontSize: 12, color: GOLD, fontWeight: 600, textDecoration: "none" }}>Lupa password?</Link>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ width: "100%", background: loading ? "#6B7280" : `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`, color: "#000", border: "none", borderRadius: 12, padding: 13, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s" }}
                >Masuk</button>
            </form>

            <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#9CA3AF" }}>
                Belum punya akun? <Link to="/register" style={{ color: GOLD, fontWeight: 700, textDecoration: "none" }}>Daftar sekarang</Link>
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}