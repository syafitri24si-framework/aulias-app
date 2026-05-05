import { useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaCheckCircle } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";


const MAROON = "#7B1C1C";
const MAROON_DARK = "#5A1313";


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
    const strengthColor = ["#E5E7EB", "#EF4444", "#F59E0B", "#16A34A"][strength];
    const strengthLabel = ["", "Lemah", "Cukup", "Kuat"][strength];


    return (
        <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: MAROON, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                    <span style={{ fontSize: 24 }}>🥐</span>
                </div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1A1A1A" }}>Buat Akun Baru</h2>
                <p style={{ margin: "6px 0 0", fontSize: 13, color: "#999" }}>Daftarkan diri Anda ke Rotte Bakery CRM</p>
            </div>


            <form onSubmit={handleSubmit}>
                {/* Name */}
                <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>Nama Lengkap</label>
                    <div style={{ position: "relative" }}>
                        <FaUser style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#CCC", fontSize: 13 }} />
                        <input type="text" placeholder="Nama Anda" value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            style={{ width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 11, paddingBottom: 11, border: `1.5px solid ${errors.name ? "#EF4444" : "#E5E7EB"}`, borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", background: "#FAFAFA" }}
                            onFocus={e => e.target.style.borderColor = MAROON}
                            onBlur={e => e.target.style.borderColor = errors.name ? "#EF4444" : "#E5E7EB"}
                        />
                    </div>
                    {errors.name && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#EF4444" }}>{errors.name}</p>}
                </div>


                {/* Email */}
                <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>Email</label>
                    <div style={{ position: "relative" }}>
                        <FaEnvelope style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#CCC", fontSize: 13 }} />
                        <input type="email" placeholder="email@example.com" value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            style={{ width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 11, paddingBottom: 11, border: `1.5px solid ${errors.email ? "#EF4444" : "#E5E7EB"}`, borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", background: "#FAFAFA" }}
                            onFocus={e => e.target.style.borderColor = MAROON}
                            onBlur={e => e.target.style.borderColor = errors.email ? "#EF4444" : "#E5E7EB"}
                        />
                    </div>
                    {errors.email && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#EF4444" }}>{errors.email}</p>}
                </div>


                {/* Password */}
                <div style={{ marginBottom: 8 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>Password</label>
                    <div style={{ position: "relative" }}>
                        <FaLock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#CCC", fontSize: 13 }} />
                        <input type={showPass ? "text" : "password"} placeholder="Min. 6 karakter" value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            style={{ width: "100%", paddingLeft: 36, paddingRight: 40, paddingTop: 11, paddingBottom: 11, border: `1.5px solid ${errors.password ? "#EF4444" : "#E5E7EB"}`, borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", background: "#FAFAFA" }}
                            onFocus={e => e.target.style.borderColor = MAROON}
                            onBlur={e => e.target.style.borderColor = errors.password ? "#EF4444" : "#E5E7EB"}
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)}
                            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#CCC", display: "flex" }}>
                            {showPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                        </button>
                    </div>
                    {/* Password strength */}
                    {form.password.length > 0 && (
                        <div style={{ display: "flex", gap: 4, marginTop: 6, alignItems: "center" }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? strengthColor : "#E5E7EB", transition: "background 0.3s" }} />
                            ))}
                            <span style={{ fontSize: 11, color: strengthColor, fontWeight: 600, marginLeft: 6 }}>{strengthLabel}</span>
                        </div>
                    )}
                    {errors.password && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#EF4444" }}>{errors.password}</p>}
                </div>


                {/* Confirm Password */}
                <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>Konfirmasi Password</label>
                    <div style={{ position: "relative" }}>
                        <FaLock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#CCC", fontSize: 13 }} />
                        <input type={showConfirm ? "text" : "password"} placeholder="Ulangi password" value={form.confirm}
                            onChange={e => setForm({ ...form, confirm: e.target.value })}
                            style={{ width: "100%", paddingLeft: 36, paddingRight: 40, paddingTop: 11, paddingBottom: 11, border: `1.5px solid ${errors.confirm ? "#EF4444" : form.confirm && form.confirm === form.password ? "#16A34A" : "#E5E7EB"}`, borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", background: "#FAFAFA" }}
                            onFocus={e => e.target.style.borderColor = MAROON}
                            onBlur={e => e.target.style.borderColor = errors.confirm ? "#EF4444" : "#E5E7EB"}
                        />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#CCC", display: "flex" }}>
                            {form.confirm && form.confirm === form.password
                                ? <FaCheckCircle size={14} style={{ color: "#16A34A" }} />
                                : showConfirm ? <FaEyeSlash size={14} /> : <FaEye size={14} />
                            }
                        </button>
                    </div>
                    {errors.confirm && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#EF4444" }}>{errors.confirm}</p>}
                </div>


                <button type="submit"
                    style={{ width: "100%", background: MAROON, color: "#fff", border: "none", borderRadius: 10, padding: 13, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = MAROON_DARK}
                    onMouseLeave={e => e.currentTarget.style.background = MAROON}
                >Daftar Sekarang</button>
            </form>


            <div style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "#AAA" }}>
                Sudah punya akun? <Link to="/login" style={{ color: MAROON, fontWeight: 700, textDecoration: "none" }}>Masuk di sini</Link>
            </div>
        </div>
    );
}

