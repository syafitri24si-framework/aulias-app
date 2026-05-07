import axios from "axios";
import { useState } from "react";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

const PRIMARY = "#5E81F4";
const PRIMARY_DARK = "#1B51E5";

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
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: 10, padding: "11px 14px", marginBottom: 18, fontSize: 13, color: "#DC2626" }}>
            <BsFillExclamationDiamondFill /> {error}
        </div>
    ) : null;

    const loadingInfo = loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F5F5F5", borderRadius: 10, padding: "11px 14px", marginBottom: 18, fontSize: 13, color: PRIMARY }}>
            <ImSpinner2 style={{ animation: "spin 1s linear infinite" }} /> Mohon tunggu...
        </div>
    ) : null;

    return (
        <div>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
                <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#1A1A1A", fontFamily: "'Lato', sans-serif" }}>Selamat Datang Kembali</h2>
                <p style={{ margin: "8px 0 0", fontSize: 14, color: PRIMARY, fontFamily: "'Lato', sans-serif" }}>Masuk ke dashboard Rotte Bakery CRM</p>
            </div>

            {errorInfo}
            {loadingInfo}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#464A5F", display: "block", marginBottom: 6, fontFamily: "'Lato', sans-serif" }}>Username</label>
                    <div style={{ position: "relative" }}>
                        <FaUser style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#AAABB0", fontSize: 13 }} />
                        <input 
                            type="text" 
                            name="username" 
                            value={dataForm.username} 
                            onChange={handleChange}
                            placeholder="Masukkan username"
                            style={{
                                width: "100%",
                                border: "1px solid #ECECF2",
                                borderRadius: 10,
                                padding: "11px 14px 11px 36px",
                                fontSize: 14,
                                outline: "none",
                                boxSizing: "border-box",
                                transition: "border 0.2s",
                                background: "#FFFFFF",
                                color: "#464A5F",
                                fontFamily: "'Lato', sans-serif"
                            }}
                            onFocus={e => e.target.style.borderColor = PRIMARY}
                            onBlur={e => e.target.style.borderColor = "#ECECF2"}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#464A5F", display: "block", marginBottom: 6, fontFamily: "'Lato', sans-serif" }}>Password</label>
                    <div style={{ position: "relative" }}>
                        <FaLock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#AAABB0", fontSize: 13 }} />
                        <input 
                            type={showPass ? "text" : "password"} 
                            name="password" 
                            value={dataForm.password} 
                            onChange={handleChange}
                            placeholder="Masukkan password"
                            style={{
                                width: "100%",
                                border: "1px solid #ECECF2",
                                borderRadius: 10,
                                padding: "11px 36px 11px 36px",
                                fontSize: 14,
                                outline: "none",
                                boxSizing: "border-box",
                                transition: "border 0.2s",
                                background: "#FFFFFF",
                                color: "#464A5F",
                                fontFamily: "'Lato', sans-serif"
                            }}
                            onFocus={e => e.target.style.borderColor = PRIMARY}
                            onBlur={e => e.target.style.borderColor = "#ECECF2"}
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPass(!showPass)}
                            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#AAABB0", display: "flex" }}>
                            {showPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                        </button>
                    </div>
                </div>

                <div style={{ textAlign: "right", marginBottom: 24 }}>
                    <Link to="/forgot" style={{ fontSize: 12, color: PRIMARY, fontWeight: 600, textDecoration: "none", fontFamily: "'Lato', sans-serif" }}>Lupa password?</Link>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{
                        width: "100%",
                        background: loading ? "#AAABB0" : PRIMARY,
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: 10,
                        padding: 12,
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "all 0.2s",
                        fontFamily: "'Lato', sans-serif"
                    }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = PRIMARY_DARK; }}
                    onMouseLeave={e => { if (!loading) e.currentTarget.style.background = PRIMARY; }}
                >Masuk</button>
            </form>

            <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#AAABB0", fontFamily: "'Lato', sans-serif" }}>
                Belum punya akun? <Link to="/register" style={{ color: PRIMARY, fontWeight: 700, textDecoration: "none" }}>Daftar sekarang</Link>
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}