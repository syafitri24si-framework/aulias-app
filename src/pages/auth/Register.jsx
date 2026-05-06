import { useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaCheckCircle } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";


const GOLD = "#D4AF37";
const GOLD_DARK = "#B8942E";

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
        alert("Pendaftaran berhasil (simulasi). Silakan login.");
        navigate("/login");
    };

    const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
    const strengthColor = ["rgba(255,255,255,0.1)", "#F87171", "#FBBF24", "#4ADE80"][strength];
    const strengthLabel = ["", "Lemah", "Cukup", "Kuat"][strength];

    return (
        <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #D4AF37, #B8942E)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                    <span style={{ fontSize: 26 }}>🥐</span>
                </div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#F3F4F6" }}>Buat Akun Baru</h2>
                <p style={{ margin: "6px 0 0", fontSize: 13, color: "#D4AF37" }}>Daftarkan diri Anda ke Rotte Bakery CRM</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#D4AF37", display: "block", marginBottom: 5 }}>Nama Lengkap</label>
                    <div style={{ position: "relative" }}>
                        <FaUser style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: 13 }} />
                        <input type="text" placeholder="Nama Anda" value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            style={{ width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 11, paddingBottom: 11, border: `1px solid ${errors.name ? "#F87171" : "rgba(212, 175, 55, 0.3)"}`, borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box", background: "rgba(0,0,0,0.3)", color: "#F3F4F6" }}
                            onFocus={e => e.target.style.borderColor = "#D4AF37"}
                            onBlur={e => e.target.style.borderColor = errors.name ? "#F87171" : "rgba(212, 175, 55, 0.3)"}
                        />
                    </div>
                    {errors.name && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#F87171" }}>{errors.name}</p>}
                </div>

                <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#D4AF37", display: "block", marginBottom: 5 }}>Email</label>
                    <div style={{ position: "relative" }}>
                        <FaEnvelope style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: 13 }} />
                        <input type="email" placeholder="email@example.com" value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            style={{ width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 11, paddingBottom: 11, border: `1px solid ${errors.email ? "#F87171" : "rgba(212, 175, 55, 0.3)"}`, borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box", background: "rgba(0,0,0,0.3)", color: "#F3F4F6" }}
                            onFocus={e => e.target.style.borderColor = "#D4AF37"}
                            onBlur={e => e.target.style.borderColor = errors.email ? "#F87171" : "rgba(212, 175, 55, 0.3)"}
                        />
                    </div>
                    {errors.email && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#F87171" }}>{errors.email}</p>}
                </div>

                <div style={{ marginBottom: 8 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#D4AF37", display: "block", marginBottom: 5 }}>Password</label>
                    <div style={{ position: "relative" }}>
                        <FaLock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: 13 }} />
                        <input type={showPass ? "text" : "password"} placeholder="Min. 6 karakter" value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            style={{ width: "100%", paddingLeft: 36, paddingRight: 40, paddingTop: 11, paddingBottom: 11, border: `1px solid ${errors.password ? "#F87171" : "rgba(212, 175, 55, 0.3)"}`, borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box", background: "rgba(0,0,0,0.3)", color: "#F3F4F6" }}
                            onFocus={e => e.target.style.borderColor = "#D4AF37"}
                            onBlur={e => e.target.style.borderColor = errors.password ? "#F87171" : "rgba(212, 175, 55, 0.3)"}
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)}
                            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex" }}>
                            {showPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                        </button>
                    </div>
                    {form.password.length > 0 && (
                        <div style={{ display: "flex", gap: 4, marginTop: 6, alignItems: "center" }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? strengthColor : "rgba(255,255,255,0.1)", transition: "background 0.3s" }} />
                            ))}
                            <span style={{ fontSize: 11, color: strengthColor, fontWeight: 600, marginLeft: 6 }}>{strengthLabel}</span>
                        </div>
                    )}
                    {errors.password && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#F87171" }}>{errors.password}</p>}
                </div>

                <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#D4AF37", display: "block", marginBottom: 5 }}>Konfirmasi Password</label>
                    <div style={{ position: "relative" }}>
                        <FaLock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: 13 }} />
                        <input type={showConfirm ? "text" : "password"} placeholder="Ulangi password" value={form.confirm}
                            onChange={e => setForm({ ...form, confirm: e.target.value })}
                            style={{ width: "100%", paddingLeft: 36, paddingRight: 40, paddingTop: 11, paddingBottom: 11, border: `1px solid ${errors.confirm ? "#F87171" : form.confirm && form.confirm === form.password ? "#4ADE80" : "rgba(212, 175, 55, 0.3)"}`, borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box", background: "rgba(0,0,0,0.3)", color: "#F3F4F6" }}
                            onFocus={e => e.target.style.borderColor = "#D4AF37"}
                            onBlur={e => e.target.style.borderColor = errors.confirm ? "#F87171" : "rgba(212, 175, 55, 0.3)"}
                        />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex" }}>
                            {form.confirm && form.confirm === form.password
                                ? <FaCheckCircle size={14} style={{ color: "#4ADE80" }} />
                                : showConfirm ? <FaEyeSlash size={14} /> : <FaEye size={14} />
                            }
                        </button>
                    </div>
                    {errors.confirm && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#F87171" }}>{errors.confirm}</p>}
                </div>

                <button type="submit"
                    style={{ width: "100%", background: "linear-gradient(135deg, #D4AF37, #B8942E)", color: "#000", border: "none", borderRadius: 12, padding: 13, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                >Daftar Sekarang</button>
            </form>

            <div style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "#9CA3AF" }}>
                Sudah punya akun? <Link to="/login" style={{ color: "#D4AF37", fontWeight: 700, textDecoration: "none" }}>Masuk di sini</Link>
            </div>
        </div>
    );
}