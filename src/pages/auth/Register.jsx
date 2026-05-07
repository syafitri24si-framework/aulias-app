import { useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaCheckCircle } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

const PRIMARY = "#5E81F4";
const PRIMARY_DARK = "#1B51E5";

export default function Register() {
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!form.name) e.name = "Nama wajib diisi";
        if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Email tidak valid";
        if (!form.password || form.password.length < 6) e.password = "Password minimal 6 karakter";
        if (form.password !== form.confirm) e.confirm = "Password tidak cocok";
        return e;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        alert("Pendaftaran berhasil! Silakan login.");
        navigate("/login");
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
        background: "#FFFFFF",
        color: "#464A5F",
        fontFamily: "'Lato', sans-serif"
    });

    return (
        <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#1A1A1A", fontFamily: "'Lato', sans-serif" }}>Buat Akun Baru</h2>
                <p style={{ margin: "8px 0 0", fontSize: 14, color: PRIMARY, fontFamily: "'Lato', sans-serif" }}>Daftarkan diri Anda ke Rotte Bakery CRM</p>
            </div>

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
                            style={{ ...inputStyle(!!errors.password), paddingRight: 40 }}
                            onFocus={e => e.target.style.borderColor = PRIMARY}
                            onBlur={e => e.target.style.borderColor = errors.password ? "#FF808B" : "#ECECF2"}
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPass(!showPass)}
                            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#AAABB0", display: "flex" }}>
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
                            style={{ ...inputStyle(!!errors.confirm, !errors.confirm && form.confirm && form.confirm === form.password), paddingRight: 40 }}
                            onFocus={e => e.target.style.borderColor = PRIMARY}
                            onBlur={e => e.target.style.borderColor = errors.confirm ? "#FF808B" : (form.confirm && form.confirm === form.password ? "#7CE7AC" : "#ECECF2")}
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowConfirm(!showConfirm)}
                            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#AAABB0", display: "flex" }}>
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
                    style={{
                        width: "100%",
                        background: PRIMARY,
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: 10,
                        padding: 12,
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        fontFamily: "'Lato', sans-serif"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = PRIMARY_DARK}
                    onMouseLeave={e => e.currentTarget.style.background = PRIMARY}
                >Daftar Sekarang</button>
            </form>

            <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#AAABB0", fontFamily: "'Lato', sans-serif" }}>
                Sudah punya akun? <Link to="/login" style={{ color: PRIMARY, fontWeight: 700, textDecoration: "none" }}>Masuk di sini</Link>
            </div>
        </div>
    );
}