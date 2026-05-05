import axios from "axios";
import { useState } from "react";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";


const MAROON = "#7B1C1C";
const MAROON_DARK = "#5A1313";
const MAROON_MUTED = "#F9EFEF";


export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [dataForm, setDataForm] = useState({ username: "emilys", password: "emilyspass" });


    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setDataForm({ ...dataForm, [name]: value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!dataForm.username || !dataForm.password) { setError("Username dan password wajib diisi"); return; }
        setLoading(true);
        setError("");
        axios.post("https://dummyjson.com/auth/login", { username: dataForm.username, password: dataForm.password })
            .then(res => { if (res.status === 200) { localStorage.setItem("token", res.data.token); navigate("/"); } })
            .catch(() => setError("Username atau password salah"))
            .finally(() => setLoading(false));
    };


    return (
        <div>
            {/* Brand */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: MAROON, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                    <span style={{ fontSize: 24 }}>🥐</span>
                </div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1A1A1A" }}>Selamat Datang Kembali</h2>
                <p style={{ margin: "6px 0 0", fontSize: 13, color: "#999" }}>Masuk ke dashboard Rotte Bakery CRM</p>
            </div>


            {/* Error */}
            {error && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: 8, padding: "11px 14px", marginBottom: 18, fontSize: 13, color: "#B91C1C" }}>
                    <BsFillExclamationDiamondFill /> {error}
                </div>
            )}


            {/* Loading */}
            {loading && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F5F5F5", borderRadius: 8, padding: "11px 14px", marginBottom: 18, fontSize: 13, color: "#666" }}>
                    <ImSpinner2 style={{ animation: "spin 1s linear infinite" }} /> Mohon tunggu...
                </div>
            )}


            <form onSubmit={handleSubmit}>
                {/* Username */}
                <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 }}>Username</label>
                    <div style={{ position: "relative" }}>
                        <FaUser style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#CCC", fontSize: 13 }} />
                        <input type="text" name="username" value={dataForm.username} onChange={handleChange}
                            placeholder="Masukkan username"
                            style={{ width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 11, paddingBottom: 11, border: "1.5px solid #E5E7EB", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border 0.2s", background: "#FAFAFA" }}
                            onFocus={e => e.target.style.borderColor = MAROON}
                            onBlur={e => e.target.style.borderColor = "#E5E7EB"}
                        />
                    </div>
                </div>


                {/* Password */}
                <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 }}>Password</label>
                    <div style={{ position: "relative" }}>
                        <FaLock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#CCC", fontSize: 13 }} />
                        <input type={showPass ? "text" : "password"} name="password" value={dataForm.password} onChange={handleChange}
                            placeholder="Masukkan password"
                            style={{ width: "100%", paddingLeft: 36, paddingRight: 40, paddingTop: 11, paddingBottom: 11, border: "1.5px solid #E5E7EB", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border 0.2s", background: "#FAFAFA" }}
                            onFocus={e => e.target.style.borderColor = MAROON}
                            onBlur={e => e.target.style.borderColor = "#E5E7EB"}
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)}
                            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#CCC", display: "flex" }}>
                            {showPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                        </button>
                    </div>
                </div>


                <div style={{ textAlign: "right", marginBottom: 20 }}>
                    <Link to="/forgot" style={{ fontSize: 12, color: MAROON, fontWeight: 600, textDecoration: "none" }}>Lupa password?</Link>
                </div>


                <button type="submit" disabled={loading}
                    style={{ width: "100%", background: loading ? "#CCC" : MAROON, color: "#fff", border: "none", borderRadius: 10, padding: 13, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s" }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = MAROON_DARK; }}
                    onMouseLeave={e => { if (!loading) e.currentTarget.style.background = MAROON; }}
                >Masuk</button>
            </form>


            <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#AAA" }}>
                Belum punya akun? <Link to="/register" style={{ color: MAROON, fontWeight: 700, textDecoration: "none" }}>Daftar sekarang</Link>
            </div>


            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

