// src/pages/auth/Register.jsx - TANPA LOGO DI ATAS!
import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaPhone, FaCheckCircle } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

// ============================================
// KONFIGURASI SUPABASE
// ============================================
const API_URL = "https://mnddhydtawungftggfdd.supabase.co/rest/v1";
const API_KEY = "sb_publishable_RyKL3yTV04oeVEeprjMVGA_PexGUflQ";

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
};

const PRIMARY = "#5E81F4";
const PRIMARY_DARK = "#1B51E5";

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [form, setForm] = useState({ 
        full_name: "", 
        email: "", 
        no_handphone: "",
        password: "", 
        confirm: "" 
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");
    const [apiError, setApiError] = useState("");

    const validate = () => {
        const e = {};
        if (!form.full_name) e.full_name = "Nama wajib diisi";
        if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Email tidak valid";
        if (!form.no_handphone || form.no_handphone.length < 10) e.no_handphone = "Nomor HP minimal 10 digit";
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
            const emailCheck = await axios.get(
                `${API_URL}/users?email=ilike.${form.email}`,
                { headers }
            );
            
            if (emailCheck.data.length > 0) {
                setApiError("Email sudah terdaftar! Silakan login.");
                setLoading(false);
                return;
            }

            const phoneCheck = await axios.get(
                `${API_URL}/customers?no_handphone=eq.${form.no_handphone}`,
                { headers }
            );
            
            if (phoneCheck.data.length > 0) {
                setApiError("Nomor HP sudah terdaftar! Silakan login.");
                setLoading(false);
                return;
            }
            
            const customerData = {
                nama_lengkap: form.full_name,
                email: form.email,
                no_handphone: form.no_handphone,
                loyalty_tier: "Bronze",
                points: 0,
                total_belanja: 0,
                join_date: new Date().toISOString().split("T")[0]
            };

            const customerRes = await axios.post(
                `${API_URL}/customers`,
                customerData,
                { headers }
            );

            const customer = customerRes.data[0] || customerRes.data;

            const userData = {
                email: form.email,
                password: form.password,
                full_name: form.full_name,
                role: "customer",
                no_handphone: form.no_handphone,
                id_customer: customer.id_customer
            };

            await axios.post(`${API_URL}/users`, userData, { headers });
            
            setSuccess("✅ Pendaftaran berhasil! Silakan login.");
            setForm({ full_name: "", email: "", no_handphone: "", password: "", confirm: "" });
            
            setTimeout(() => {
                navigate("/login");
            }, 2000);
            
        } catch (err) {
            console.error("Register error:", err);
            setApiError(err.response?.data?.message || "Terjadi kesalahan saat pendaftaran");
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
        padding: "11px 14px 11px 40px",
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
            {/* ===== HEADER - TANPA LOGO! ===== */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#1A1A1A", fontFamily: "'Lato', sans-serif" }}>
                    Daftar Member
                </h2>
                <p style={{ margin: "8px 0 0", fontSize: 14, color: PRIMARY, fontFamily: "'Lato', sans-serif" }}>
                    Daftar untuk menikmati program loyalitas Rotte Rewards
                </p>
            </div>

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
                <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#464A5F", display: "block", marginBottom: 5, fontFamily: "'Lato', sans-serif" }}>Nama Lengkap</label>
                    <div style={{ position: "relative" }}>
                        <FaUser style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#AAABB0", fontSize: 14 }} />
                        <input 
                            type="text" 
                            name="full_name"
                            placeholder="Nama lengkap" 
                            value={form.full_name}
                            onChange={e => setForm({ ...form, full_name: e.target.value })}
                            disabled={loading}
                            style={inputStyle(!!errors.full_name)}
                            onFocus={e => e.target.style.borderColor = PRIMARY}
                            onBlur={e => e.target.style.borderColor = errors.full_name ? "#FF808B" : "#ECECF2"}
                        />
                    </div>
                    {errors.full_name && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#FF808B", fontFamily: "'Lato', sans-serif" }}>{errors.full_name}</p>}
                </div>

                <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#464A5F", display: "block", marginBottom: 5, fontFamily: "'Lato', sans-serif" }}>Email</label>
                    <div style={{ position: "relative" }}>
                        <FaEnvelope style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#AAABB0", fontSize: 14 }} />
                        <input 
                            type="email" 
                            name="email"
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

                <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#464A5F", display: "block", marginBottom: 5, fontFamily: "'Lato', sans-serif" }}>Nomor HP</label>
                    <div style={{ position: "relative" }}>
                        <FaPhone style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#AAABB0", fontSize: 14 }} />
                        <input 
                            type="text" 
                            name="no_handphone"
                            placeholder="08xx-xxxx-xxxx" 
                            value={form.no_handphone}
                            onChange={e => setForm({ ...form, no_handphone: e.target.value })}
                            disabled={loading}
                            style={inputStyle(!!errors.no_handphone)}
                            onFocus={e => e.target.style.borderColor = PRIMARY}
                            onBlur={e => e.target.style.borderColor = errors.no_handphone ? "#FF808B" : "#ECECF2"}
                        />
                    </div>
                    {errors.no_handphone && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#FF808B", fontFamily: "'Lato', sans-serif" }}>{errors.no_handphone}</p>}
                </div>

                <div style={{ marginBottom: 8 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#464A5F", display: "block", marginBottom: 5, fontFamily: "'Lato', sans-serif" }}>Password</label>
                    <div style={{ position: "relative" }}>
                        <FaLock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#AAABB0", fontSize: 14 }} />
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
                            {showPass ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </button>
                    </div>
                    
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

                <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#464A5F", display: "block", marginBottom: 5, fontFamily: "'Lato', sans-serif" }}>Konfirmasi Password</label>
                    <div style={{ position: "relative" }}>
                        <FaLock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#AAABB0", fontSize: 14 }} />
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
                                ? <FaCheckCircle size={16} style={{ color: "#7CE7AC" }} />
                                : showConfirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />
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
                        background: loading ? "#AAABB0" : `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: 10,
                        padding: 13,
                        fontSize: 15,
                        fontWeight: 700,
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "all 0.3s",
                        fontFamily: "'Lato', sans-serif",
                        boxShadow: loading ? "none" : `0 4px 16px ${PRIMARY}40`
                    }}
                    onMouseEnter={e => { 
                        if (!loading) {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = `0 8px 24px ${PRIMARY}60`;
                        }
                    }}
                    onMouseLeave={e => { 
                        if (!loading) {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = `0 4px 16px ${PRIMARY}40`;
                        }
                    }}
                >
                    {loading ? "Memproses..." : "Daftar Sekarang"}
                </button>
            </form>

            <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#AAABB0", fontFamily: "'Lato', sans-serif" }}>
                Sudah punya akun? <Link to="/login" style={{ color: PRIMARY, fontWeight: 700, textDecoration: "none" }}>Masuk di sini</Link>
            </div>

            <div style={{ 
                textAlign: "center", 
                marginTop: 16,
                paddingTop: 14,
                borderTop: "1px solid #F0F0F3",
                fontSize: 11,
                color: "#AAABB0"
            }}>
                🔒 Dengan mendaftar, Anda menyetujui Syarat & Ketentuan Rotte
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}