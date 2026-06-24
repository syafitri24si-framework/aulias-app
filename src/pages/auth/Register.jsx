import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaCheckCircle } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

// ============================================
// KONFIGURASI SUPABASE
// Ganti dengan milik Anda
// ============================================
const API_URL = "https://mnddhydtawungftggfdd.supabase.co/rest/v1/users"
const API_KEY = "sb_publishable_RyKL3yTV04oeVEeprjMVGA_PexGUflQ"

const headers = {
  apikey: API_KEY,
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
}

const PRIMARY = "#5E81F4";
const PRIMARY_DARK = "#1B51E5";

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");
    const [apiError, setApiError] = useState("");

    const validate = () => {
        const e = {};
        if (!form.name) e.name = "Nama wajib diisi";
        if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Email tidak valid";
        if (!form.password || form.password.length < 6) e.password = "Password minimal 6 karakter";
        if (form.password !== form.confirm) e.confirm = "Password tidak cocok";
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");
        setSuccess("");
        
        const errs = validate();
        if (Object.keys(errs).length > 0) { 
            setErrors(errs); 
            return; 
        }
        
        setLoading(true);
        setErrors({});
        
        try {
            // Cek apakah email sudah terdaftar
            const checkResponse = await axios.get(
                `${API_URL}?email=ilike.${form.email}`,
                { headers }
            );
            
            if (checkResponse.data.length > 0) {
                setApiError("Email sudah terdaftar! Gunakan email lain.");
                setLoading(false);
                return;
            }
            
            // Buat user baru di Supabase
            const userData = {
                email: form.email,
                password: form.password,
                full_name: form.name,
                role: "staff"
            };
            
            await axios.post(API_URL, userData, { headers });
            
            setSuccess("Pendaftaran berhasil! Silakan login.");
            
            // Reset form
            setForm({ name: "", email: "", password: "", confirm: "" });
            
            // Redirect ke login setelah 2 detik
            setTimeout(() => {
                navigate("/login");
            }, 2000);
            
        } catch (err) {
            console.error("Register error:", err);
            if (err.response) {
                setApiError(err.response.data.message || "Terjadi kesalahan saat pendaftaran");
            } else if (err.request) {
                setApiError("Tidak dapat terhubung ke server. Cek koneksi internet Anda.");
            } else {
                setApiError(err.message || "Terjadi kesalahan");
            }
        } finally {
            setLoading(false);
        }
    };

    const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
    const strengthColor = ["#ECECF2", "#FF808B", "#F4BE5E", "#7CE7AC"][strength];
    const strengthLabel = ["", "Lemah", "Cukup", "Kuat"][strength];

    const inputStyle = (hasError = false, isSuccess = false) => ({
        width: "100%",
        border: `1px solid ${hasError ? "#FF808B" : isSuccess ? "#7CE7AC" : "#ECECF2"}`,
        borderRadius: 10,
        padding: "11px 14px 11px 36px",
        fontSize: 14,
        outline: "none",
        boxSizing: "border-box",
        transition: "border 0.2s",
        background: loading ? "#F5F5F5" : "#FFFFFF",
        color: "#464A5F",
        fontFamily: "'Lato', sans-serif",
        cursor: loading ? "not-allowed" : "text"
    });

    return (
        <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#1A1A1A", fontFamily: "'Lato', sans-serif" }}>Buat Akun Baru</h2>
                <p style={{ margin: "8px 0 0", fontSize: 14, color: PRIMARY, fontFamily: "'Lato', sans-serif" }}>Daftarkan diri Anda ke Rotte Bakery CRM</p>
            </div>

            {/* Loading Info */}
            {loading && (
                <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 8, 
                    background: "#F5F5F5", 
                    borderRadius: 10, 
                    padding: "11px 14px", 
                    marginBottom: 18, 
                    fontSize: 13, 
                    color: PRIMARY,
                    fontFamily: "'Lato', sans-serif"
                }}>
                    <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> 
                    Mohon tunggu...
                </div>
            )}

            {/* Error dari API */}
            {apiError && (
                <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 8, 
                    background: "#FEE2E2", 
                    border: "1px solid #FCA5A5", 
                    borderRadius: 10, 
                    padding: "11px 14px", 
                    marginBottom: 18, 
                    fontSize: 13, 
                    color: "#DC2626",
                    fontFamily: "'Lato', sans-serif"
                }}>
                    <span>⚠️</span> {apiError}
                </div>
            )}

            {/* Success */}
            {success && (
                <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 8, 
                    background: "#D1FAE5", 
                    border: "1px solid #6EE7B7", 
                    borderRadius: 10, 
                    padding: "11px 14px", 
                    marginBottom: 18, 
                    fontSize: 13, 
                    color: "#065F46",
                    fontFamily: "'Lato', sans-serif"
                }}>
                    <span>✅</span> {success}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Nama Lengkap */}
                <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#464A5F", display: "block", marginBottom: 5, fontFamily: "'Lato', sans-serif" }}>Nama Lengkap</label>
                    <div style={{ position: "relative" }}>
                        <FaUser style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#AAABB0", fontSize: 13 }} />
                        <input 
                            type="text" 
                            placeholder="Nama Anda" 
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            disabled={loading}
                            style={inputStyle(!!errors.name)}
                            onFocus={e => e.target.style.borderColor = PRIMARY}
                            onBlur={e => e.target.style.borderColor = errors.name ? "#FF808B" : "#ECECF2"}
                        />
                    </div>
                    {errors.name && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#FF808B", fontFamily: "'Lato', sans-serif" }}>{errors.name}</p>}
                </div>

                {/* Email */}
                <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#464A5F", display: "block", marginBottom: 5, fontFamily: "'Lato', sans-serif" }}>Email</label>
                    <div style={{ position: "relative" }}>
                        <FaEnvelope style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#AAABB0", fontSize: 13 }} />
                        <input 
                            type="email" 
                            placeholder="email@example.com" 
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            disabled={loading}
                            style={inputStyle(!!errors.email)}
                            onFocus={e => e.target.style.borderColor = PRIMARY}
                            onBlur={e => e.target.style.borderColor = errors.email ? "#FF808B" : "#ECECF2"}
                        />
                    </div>
                    {errors.email && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#FF808B", fontFamily: "'Lato', sans-serif" }}>{errors.email}</p>}
                </div>

                {/* Password */}
                <div style={{ marginBottom: 8 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#464A5F", display: "block", marginBottom: 5, fontFamily: "'Lato', sans-serif" }}>Password</label>
                    <div style={{ position: "relative" }}>
                        <FaLock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#AAABB0", fontSize: 13 }} />
                        <input 
                            type={showPass ? "text" : "password"} 
                            placeholder="Min. 6 karakter" 
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            disabled={loading}
                            style={{ ...inputStyle(!!errors.password), paddingRight: 40 }}
                            onFocus={e => e.target.style.borderColor = PRIMARY}
                            onBlur={e => e.target.style.borderColor = errors.password ? "#FF808B" : "#ECECF2"}
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPass(!showPass)}
                            disabled={loading}
                            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: loading ? "not-allowed" : "pointer", color: "#AAABB0", display: "flex" }}>
                            {showPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                        </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {form.password.length > 0 && (
                        <div style={{ display: "flex", gap: 4, marginTop: 8, alignItems: "center" }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= strength ? strengthColor : "#ECECF2", transition: "background 0.3s" }} />
                            ))}
                            <span style={{ fontSize: 11, color: strengthColor, fontWeight: 600, marginLeft: 8, fontFamily: "'Lato', sans-serif" }}>{strengthLabel}</span>
                        </div>
                    )}
                    {errors.password && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#FF808B", fontFamily: "'Lato', sans-serif" }}>{errors.password}</p>}
                </div>

                {/* Konfirmasi Password */}
                <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#464A5F", display: "block", marginBottom: 5, fontFamily: "'Lato', sans-serif" }}>Konfirmasi Password</label>
                    <div style={{ position: "relative" }}>
                        <FaLock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#AAABB0", fontSize: 13 }} />
                        <input 
                            type={showConfirm ? "text" : "password"} 
                            placeholder="Ulangi password" 
                            value={form.confirm}
                            onChange={e => setForm({ ...form, confirm: e.target.value })}
                            disabled={loading}
                            style={{ ...inputStyle(!!errors.confirm, !errors.confirm && form.confirm && form.confirm === form.password), paddingRight: 40 }}
                            onFocus={e => e.target.style.borderColor = PRIMARY}
                            onBlur={e => e.target.style.borderColor = errors.confirm ? "#FF808B" : (form.confirm && form.confirm === form.password ? "#7CE7AC" : "#ECECF2")}
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowConfirm(!showConfirm)}
                            disabled={loading}
                            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: loading ? "not-allowed" : "pointer", color: "#AAABB0", display: "flex" }}>
                            {form.confirm && form.confirm === form.password
                                ? <FaCheckCircle size={14} style={{ color: "#7CE7AC" }} />
                                : showConfirm ? <FaEyeSlash size={14} /> : <FaEye size={14} />
                            }
                        </button>
                    </div>
                    {errors.confirm && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#FF808B", fontFamily: "'Lato', sans-serif" }}>{errors.confirm}</p>}
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
                >
                    {loading ? "Memproses..." : "Daftar Sekarang"}
                </button>
            </form>

            <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#AAABB0", fontFamily: "'Lato', sans-serif" }}>
                Sudah punya akun? <Link to="/login" style={{ color: PRIMARY, fontWeight: 700, textDecoration: "none" }}>Masuk di sini</Link>
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}