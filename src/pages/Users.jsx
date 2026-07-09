// src/pages/Users.jsx - TANPA ROLE MANAGER!
import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { BsDatabaseExclamation } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";

// ============================================
// KONFIGURASI SUPABASE
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

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        full_name: "",
        role: "staff"
    });

    // Load data users
    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await axios.get(API_URL, { headers });
            setUsers(response.data);
        } catch (err) {
            console.error("Error loading users:", err);
            setError("Gagal memuat data user");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            if (isEditing) {
                await axios.patch(
                    `${API_URL}?id=eq.${editId}`,
                    formData,
                    { headers }
                );
                setSuccess("User berhasil diupdate!");
                setIsEditing(false);
                setEditId(null);
            } else {
                const checkResponse = await axios.get(
                    `${API_URL}?email=eq.${formData.email}`,
                    { headers }
                );
                
                if (checkResponse.data.length > 0) {
                    setError("Email sudah terdaftar!");
                    setLoading(false);
                    return;
                }

                await axios.post(API_URL, formData, { headers });
                setSuccess("User berhasil ditambahkan!");
            }

            setFormData({
                email: "",
                password: "",
                full_name: "",
                role: "staff"
            });

            loadUsers();
            setTimeout(() => setSuccess(""), 3000);

        } catch (err) {
            console.error("Error:", err);
            setError(err.response?.data?.message || "Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus user ini?")) return;

        try {
            setLoading(true);
            await axios.delete(`${API_URL}?id=eq.${id}`, { headers });
            setSuccess("User berhasil dihapus!");
            loadUsers();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            console.error("Error deleting user:", err);
            setError("Gagal menghapus user");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setIsEditing(true);
        setEditId(user.id);
        setFormData({
            email: user.email,
            password: "",
            full_name: user.full_name || "",
            role: user.role || "staff"
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditId(null);
        setFormData({
            email: "",
            password: "",
            full_name: "",
            role: "staff"
        });
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const getRoleStyle = (role) => {
        const styles = {
            admin: { bg: "#EBF4FF", color: "#1B51E5" },
            staff: { bg: "#F3F4F6", color: "#6B7280" }
        };
        return styles[role] || styles.staff;
    };

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1A1A1A", fontFamily: "'Lato', sans-serif" }}>
                    Manajemen User
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: 14, color: "#6B7280", fontFamily: "'Lato', sans-serif" }}>
                    Kelola data pengguna aplikasi
                </p>
            </div>

            {error && (
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
                    <span>⚠️</span> {error}
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

            {/* Form */}
            <div style={{ 
                background: "white", 
                borderRadius: 16, 
                padding: 24, 
                marginBottom: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
            }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#1A1A1A", fontFamily: "'Lato', sans-serif" }}>
                    {isEditing ? "✏️ Edit User" : "➕ Tambah User Baru"}
                </h3>
                
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <input
                            name="full_name"
                            type="text"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="Nama Lengkap"
                            disabled={loading}
                            required
                            style={{
                                padding: "10px 14px",
                                border: "1px solid #ECECF2",
                                borderRadius: 10,
                                fontSize: 14,
                                outline: "none",
                                fontFamily: "'Lato', sans-serif",
                                background: loading ? "#F5F5F5" : "white"
                            }}
                        />
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            disabled={loading || isEditing}
                            required
                            style={{
                                padding: "10px 14px",
                                border: "1px solid #ECECF2",
                                borderRadius: 10,
                                fontSize: 14,
                                outline: "none",
                                fontFamily: "'Lato', sans-serif",
                                background: (loading || isEditing) ? "#F5F5F5" : "white",
                                cursor: isEditing ? "not-allowed" : "text"
                            }}
                        />
                        <input
                            name="password"
                            type="text"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={isEditing ? "Password (kosongkan jika tidak diubah)" : "Password"}
                            disabled={loading}
                            required={!isEditing}
                            style={{
                                padding: "10px 14px",
                                border: "1px solid #ECECF2",
                                borderRadius: 10,
                                fontSize: 14,
                                outline: "none",
                                fontFamily: "'Lato', sans-serif",
                                background: loading ? "#F5F5F5" : "white"
                            }}
                        />
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            disabled={loading}
                            style={{
                                padding: "10px 14px",
                                border: "1px solid #ECECF2",
                                borderRadius: 10,
                                fontSize: 14,
                                outline: "none",
                                fontFamily: "'Lato', sans-serif",
                                background: loading ? "#F5F5F5" : "white"
                            }}
                        >
                            {/* 🔥 HANYA staff & admin! */}
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: "10px 24px",
                                background: loading ? "#AAABB0" : PRIMARY,
                                color: "white",
                                border: "none",
                                borderRadius: 10,
                                fontSize: 14,
                                fontWeight: 700,
                                cursor: loading ? "not-allowed" : "pointer",
                                fontFamily: "'Lato', sans-serif",
                                transition: "all 0.2s"
                            }}
                            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = PRIMARY_DARK; }}
                            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = PRIMARY; }}
                        >
                            {loading ? "Loading..." : isEditing ? "Update User" : "Tambah User"}
                        </button>
                        
                        {isEditing && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                style={{
                                    padding: "10px 24px",
                                    background: "#9CA3AF",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 10,
                                    fontSize: 14,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    fontFamily: "'Lato', sans-serif",
                                    transition: "all 0.2s"
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "#6B7280"}
                                onMouseLeave={e => e.currentTarget.style.background = "#9CA3AF"}
                            >
                                Batal
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Tabel */}
            <div style={{ 
                background: "white", 
                borderRadius: 16, 
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
            }}>
                <div style={{ 
                    padding: "16px 24px", 
                    borderBottom: "1px solid #ECECF2",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1A1A1A", fontFamily: "'Lato', sans-serif" }}>
                        Daftar User ({users.length})
                    </h3>
                    <button
                        onClick={loadUsers}
                        disabled={loading}
                        style={{
                            background: "transparent",
                            border: "none",
                            cursor: loading ? "not-allowed" : "pointer",
                            color: PRIMARY,
                            fontSize: 13,
                            fontFamily: "'Lato', sans-serif"
                        }}
                    >
                        {loading ? "🔄 Memuat..." : "🔄 Refresh"}
                    </button>
                </div>

                {loading && (
                    <div style={{ 
                        padding: 40, 
                        textAlign: "center", 
                        color: "#6B7280",
                        fontFamily: "'Lato', sans-serif"
                    }}>
                        <ImSpinner2 style={{ 
                            animation: "spin 1s linear infinite", 
                            fontSize: 32,
                            color: PRIMARY,
                            display: "block",
                            margin: "0 auto 12px"
                        }} />
                        Memuat data user...
                    </div>
                )}

                {!loading && users.length === 0 && (
                    <div style={{ 
                        padding: 40, 
                        textAlign: "center", 
                        color: "#6B7280",
                        fontFamily: "'Lato', sans-serif"
                    }}>
                        <BsDatabaseExclamation style={{ fontSize: 40, display: "block", margin: "0 auto 12px", color: "#D1D5DB" }} />
                        Belum ada data user
                    </div>
                )}

                {!loading && users.length > 0 && (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Lato', sans-serif" }}>
                            <thead style={{ background: "#F9FAFB" }}>
                                <tr>
                                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" }}>#</th>
                                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" }}>Nama</th>
                                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" }}>Email</th>
                                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" }}>Role</th>
                                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" }}>Dibuat</th>
                                    <th style={{ padding: "12px 16px", textAlign: "center", fontSize: 12, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => {
                                    const roleStyle = getRoleStyle(user.role);
                                    return (
                                        <tr key={user.id} style={{ borderBottom: "1px solid #ECECF2" }}>
                                            <td style={{ padding: "12px 16px", fontSize: 14, color: "#6B7280" }}>{index + 1}</td>
                                            <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>
                                                {user.full_name || "-"}
                                            </td>
                                            <td style={{ padding: "12px 16px", fontSize: 14, color: "#464A5F" }}>{user.email}</td>
                                            <td style={{ padding: "12px 16px" }}>
                                                <span style={{
                                                    display: "inline-block",
                                                    padding: "2px 12px",
                                                    borderRadius: 20,
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    background: roleStyle.bg,
                                                    color: roleStyle.color
                                                }}>
                                                    {user.role || "staff"}
                                                </span>
                                            </td>
                                            <td style={{ padding: "12px 16px", fontSize: 13, color: "#6B7280" }}>
                                                {formatDate(user.created_at)}
                                            </td>
                                            <td style={{ padding: "12px 16px", textAlign: "center" }}>
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    disabled={loading}
                                                    style={{
                                                        background: "transparent",
                                                        border: "none",
                                                        cursor: loading ? "not-allowed" : "pointer",
                                                        color: PRIMARY,
                                                        marginRight: 8,
                                                        fontSize: 16
                                                    }}
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    disabled={loading}
                                                    style={{
                                                        background: "transparent",
                                                        border: "none",
                                                        cursor: loading ? "not-allowed" : "pointer",
                                                        color: "#EF4444",
                                                        fontSize: 16
                                                    }}
                                                    title="Hapus"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}