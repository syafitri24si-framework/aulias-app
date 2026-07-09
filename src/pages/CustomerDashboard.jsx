// src/pages/CustomerDashboard.jsx - PAKAI AXIOS
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaCrown, FaMedal, FaTrophy, FaHistory, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";

const PRIMARY = "#5E81F4";

// ================================================================
// KONFIGURASI SUPABASE (SAMA KAYA usersAPI.js!)
// ================================================================
const API_URL = "https://mnddhydtawungftggfdd.supabase.co/rest/v1";
const API_KEY = "sb_publishable_RyKL3yTV04oeVEeprjMVGA_PexGUflQ";

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
};

export default function CustomerDashboard() {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                // ===== 1. Ambil user dari localStorage =====
                const userStr = localStorage.getItem("user");
                console.log("📦 localStorage user:", userStr);

                if (!userStr) {
                    setError("Silakan login terlebih dahulu.");
                    setLoading(false);
                    return;
                }

                const userData = JSON.parse(userStr);
                console.log("👤 User data:", userData);

                // ===== CEK: Apakah user punya id_customer? =====
                if (!userData.id_customer) {
                    console.log("❌ id_customer is NULL or undefined!");
                    setError("Akun Anda belum terhubung dengan data member. Hubungi admin.");
                    setLoading(false);
                    return;
                }

                console.log("✅ id_customer found:", userData.id_customer);

                // ===== 2. Ambil data customer dari Supabase (PAKAI AXIOS!) =====
                console.log("🔍 Fetching customer with ID:", userData.id_customer);
                
                const customerResponse = await axios.get(
                    `${API_URL}/customers?id_customer=eq.${userData.id_customer}`,
                    { headers }
                );
                
                console.log("📊 Customer response:", customerResponse.data);

                if (!customerResponse.data || customerResponse.data.length === 0) {
                    setError("Data member tidak ditemukan. Pastikan Anda sudah terdaftar sebagai member.");
                    setLoading(false);
                    return;
                }

                const customerData = customerResponse.data[0];
                console.log("✅ Customer found:", customerData);
                setCustomer(customerData);

                // ===== 3. Ambil transaksi customer (PAKAI AXIOS!) =====
                console.log("🔍 Fetching transactions for customer:", userData.id_customer);
                
                const transResponse = await axios.get(
                    `${API_URL}/transactions?id_customer=eq.${userData.id_customer}&order=tanggal_transaksi.desc`,
                    { headers }
                );
                
                console.log("📊 Transactions response:", transResponse.data);
                setTransactions(transResponse.data || []);

            } catch (err) {
                console.error("❌ Error loading data:", err);
                console.error("❌ Error response:", err.response);
                console.error("❌ Error message:", err.message);
                setError("Gagal memuat data: " + (err.message || "Coba lagi nanti"));
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    // ========== LOADING ==========
    if (loading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                background: "#F6F6F6"
            }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        border: "3px solid #E8ECF2",
                        borderTop: `3px solid ${PRIMARY}`,
                        animation: "spin 0.8s linear infinite",
                        margin: "0 auto 16px"
                    }} />
                    <p style={{ color: "#8181A5" }}>Memuat data member...</p>
                </div>
            </div>
        );
    }

    // ========== ERROR ==========
    if (error) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                background: "#F6F6F6"
            }}>
                <div style={{
                    background: "#FFFFFF",
                    padding: "40px",
                    borderRadius: 16,
                    textAlign: "center",
                    maxWidth: 400
                }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
                    <h2 style={{ color: "#1A1A1A" }}>Oops!</h2>
                    <p style={{ color: "#8181A5" }}>{error}</p>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: "12px 24px",
                            background: PRIMARY,
                            color: "#FFF",
                            border: "none",
                            borderRadius: 10,
                            cursor: "pointer",
                            marginTop: 16,
                            fontWeight: 600
                        }}
                    >
                        Kembali ke Login
                    </button>
                </div>
            </div>
        );
    }

    if (!customer) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                background: "#F6F6F6"
            }}>
                <div style={{
                    background: "#FFFFFF",
                    padding: "40px",
                    borderRadius: 16,
                    textAlign: "center"
                }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>👤</div>
                    <h2>Bukan Member!</h2>
                    <p style={{ color: "#8181A5" }}>Anda belum terdaftar sebagai member Rotte Rewards.</p>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: "12px 24px",
                            background: PRIMARY,
                            color: "#FFF",
                            border: "none",
                            borderRadius: 10,
                            cursor: "pointer",
                            marginTop: 16
                        }}
                    >
                        Kembali ke Login
                    </button>
                </div>
            </div>
        );
    }

    // ========== TIER CONFIG ==========
    const tierConfig = {
        Gold: {
            icon: <FaCrown size={24} />,
            color: PRIMARY,
            bg: "rgba(94, 129, 244, 0.1)",
            border: "2px solid #5E81F4",
            label: "Gold Member ✨"
        },
        Silver: {
            icon: <FaTrophy size={24} />,
            color: "#8181A5",
            bg: "rgba(129, 129, 165, 0.1)",
            border: "2px solid #8181A5",
            label: "Silver Member 🥈"
        },
        Bronze: {
            icon: <FaMedal size={24} />,
            color: "#F4BE5E",
            bg: "rgba(244, 190, 94, 0.1)",
            border: "2px solid #F4BE5E",
            label: "Bronze Member 🥉"
        },
        None: {
            icon: <FaUser size={24} />,
            color: "#AAABB0",
            bg: "rgba(170, 171, 176, 0.1)",
            border: "2px solid #AAABB0",
            label: "Non Member"
        }
    };

    const tier = tierConfig[customer.loyalty_tier] || tierConfig.None;

    // ========== RENDER ==========
    return (
        <div style={{
            minHeight: "100vh",
            background: "#F6F6F6",
            fontFamily: "'Inter', 'Lato', sans-serif"
        }}>
            {/* ===== HEADER ===== */}
            <header style={{
                background: "#FFFFFF",
                padding: "16px 32px",
                borderBottom: "1px solid #F0F0F3",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "sticky",
                top: 0,
                zIndex: 10
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: PRIMARY,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#FFF",
                        fontWeight: 800,
                        fontSize: 18
                    }}>
                        🍞
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 18, color: "#1A1A1A" }}>Rotte Bakery</div>
                        <div style={{ fontSize: 11, color: "#8181A5" }}>Member Dashboard</div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 16px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#FF808B",
                        fontSize: 14,
                        fontWeight: 600,
                        borderRadius: 8,
                        transition: "background 0.2s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255, 128, 139, 0.1)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                    <FaSignOutAlt /> Logout
                </button>
            </header>

            {/* ===== MAIN CONTENT ===== */}
            <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
                
                {/* ===== PROFIL CARD ===== */}
                <div style={{
                    background: "#FFFFFF",
                    borderRadius: 20,
                    padding: "32px",
                    border: "1px solid #F0F0F3",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                    marginBottom: 24
                }}>
                    <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
                        <div style={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            background: tier.bg,
                            border: tier.border,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: tier.color,
                            fontSize: 32,
                            flexShrink: 0
                        }}>
                            {customer.nama_lengkap?.charAt(0).toUpperCase()}
                        </div>

                        <div style={{ flex: 1 }}>
                            <h1 style={{ margin: 0, fontSize: 24, color: "#1A1A1A" }}>
                                {customer.nama_lengkap}
                            </h1>
                            <div style={{ display: "flex", gap: 12, marginTop: 4, flexWrap: "wrap" }}>
                                <span style={{ fontSize: 13, color: "#8181A5" }}>
                                    📱 {customer.no_handphone}
                                </span>
                                {customer.email && (
                                    <span style={{ fontSize: 13, color: "#8181A5" }}>
                                        ✉️ {customer.email}
                                    </span>
                                )}
                            </div>
                            <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
                                <span style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 6,
                                    background: tier.bg,
                                    color: tier.color,
                                    padding: "4px 14px",
                                    borderRadius: 20,
                                    fontSize: 13,
                                    fontWeight: 700,
                                    border: tier.border
                                }}>
                                    {tier.icon} {tier.label}
                                </span>
                                <span style={{
                                    fontSize: 12,
                                    color: "#8181A5",
                                    padding: "4px 12px",
                                    background: "#F8F9FC",
                                    borderRadius: 20
                                }}>
                                    📅 Bergabung: {customer.join_date ? new Date(customer.join_date).toLocaleDateString("id-ID") : "-"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== STATS CARDS ===== */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: 16,
                    marginBottom: 24
                }}>
                    <div style={{
                        background: "#FFFFFF",
                        padding: "20px",
                        borderRadius: 16,
                        border: "1px solid #F0F0F3",
                        textAlign: "center"
                    }}>
                        <div style={{ fontSize: 32, fontWeight: 800, color: PRIMARY }}>
                            {customer.points || 0}
                        </div>
                        <div style={{ fontSize: 13, color: "#8181A5" }}>⭐ Total Poin</div>
                    </div>

                    <div style={{
                        background: "#FFFFFF",
                        padding: "20px",
                        borderRadius: 16,
                        border: "1px solid #F0F0F3",
                        textAlign: "center"
                    }}>
                        <div style={{ fontSize: 32, fontWeight: 800, color: PRIMARY }}>
                            Rp {(customer.total_belanja || 0).toLocaleString()}
                        </div>
                        <div style={{ fontSize: 13, color: "#8181A5" }}>💰 Total Belanja</div>
                    </div>

                    <div style={{
                        background: "#FFFFFF",
                        padding: "20px",
                        borderRadius: 16,
                        border: "1px solid #F0F0F3",
                        textAlign: "center"
                    }}>
                        <div style={{ fontSize: 32, fontWeight: 800, color: PRIMARY }}>
                            {transactions.length}
                        </div>
                        <div style={{ fontSize: 13, color: "#8181A5" }}>🛒 Transaksi</div>
                    </div>
                </div>

                {/* ===== RIWAYAT TRANSAKSI ===== */}
                <div style={{
                    background: "#FFFFFF",
                    borderRadius: 16,
                    border: "1px solid #F0F0F3",
                    overflow: "hidden"
                }}>
                    <div style={{
                        padding: "16px 24px",
                        borderBottom: "1px solid #F0F0F3",
                        display: "flex",
                        alignItems: "center",
                        gap: 10
                    }}>
                        <FaHistory style={{ color: PRIMARY }} />
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1A1A1A" }}>
                            Riwayat Transaksi
                        </h3>
                        <span style={{
                            marginLeft: "auto",
                            fontSize: 12,
                            color: "#8181A5",
                            background: "#F8F9FC",
                            padding: "2px 12px",
                            borderRadius: 12
                        }}>
                            {transactions.length} transaksi
                        </span>
                    </div>

                    {transactions.length === 0 ? (
                        <div style={{
                            padding: "48px",
                            textAlign: "center",
                            color: "#AAABB0"
                        }}>
                            <FaHistory size={32} style={{ display: "block", margin: "0 auto 12px", opacity: 0.3 }} />
                            <p>Belum ada riwayat transaksi</p>
                            <p style={{ fontSize: 12 }}>Mulai berbelanja untuk mengumpulkan poin!</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "#F8F9FC", borderBottom: "1px solid #E8ECF0" }}>
                                        <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, color: "#8181A5" }}>Tanggal</th>
                                        <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, color: "#8181A5" }}>Produk</th>
                                        <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, color: "#8181A5" }}>Qty</th>
                                        <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, color: "#8181A5" }}>Total</th>
                                        <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, color: "#8181A5" }}>Poin</th>
                                        <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, color: "#8181A5" }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((t, idx) => (
                                        <tr key={idx} style={{ borderBottom: "1px solid #F0F0F3" }}>
                                            <td style={{ padding: "12px 16px", fontSize: 13 }}>
                                                {t.tanggal_transaksi ? new Date(t.tanggal_transaksi).toLocaleDateString("id-ID") : "-"}
                                            </td>
                                            <td style={{ padding: "12px 16px", fontSize: 13 }}>
                                                {t.nama_produk || "-"}
                                            </td>
                                            <td style={{ padding: "12px 16px", fontSize: 13 }}>
                                                {t.qty || 1}
                                            </td>
                                            <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: PRIMARY }}>
                                                Rp {t.total_belanja?.toLocaleString() || 0}
                                            </td>
                                            <td style={{ padding: "12px 16px", fontSize: 13 }}>
                                                +{t.poin_didapat || 0}
                                            </td>
                                            <td style={{ padding: "12px 16px" }}>
                                                <span style={{
                                                    padding: "2px 10px",
                                                    borderRadius: 12,
                                                    fontSize: 11,
                                                    fontWeight: 600,
                                                    background: t.status === "Completed" ? "rgba(124, 231, 172, 0.15)" :
                                                               t.status === "Pending" ? "rgba(244, 190, 94, 0.15)" :
                                                               "rgba(255, 128, 139, 0.15)",
                                                    color: t.status === "Completed" ? "#2E7D32" :
                                                           t.status === "Pending" ? "#E6A017" : "#C62828"
                                                }}>
                                                    {t.status || "Completed"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* ===== INFO SYARAT TIER ===== */}
                <div style={{
                    marginTop: 24,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 12,
                    fontSize: 12
                }}>
                    <div style={{
                        background: "rgba(244, 190, 94, 0.05)",
                        padding: "12px 16px",
                        borderRadius: 12,
                        border: "1px solid rgba(244, 190, 94, 0.2)",
                        textAlign: "center"
                    }}>
                        <div style={{ color: "#F4BE5E", fontWeight: 700 }}>🥉 Bronze</div>
                        <div style={{ color: "#8181A5", fontSize: 11 }}>0 - 499 poin</div>
                        <div style={{ fontSize: 10, color: "#AAABB0", marginTop: 4 }}>Poin dasar</div>
                    </div>
                    <div style={{
                        background: "rgba(129, 129, 165, 0.05)",
                        padding: "12px 16px",
                        borderRadius: 12,
                        border: "1px solid rgba(129, 129, 165, 0.2)",
                        textAlign: "center"
                    }}>
                        <div style={{ color: "#8181A5", fontWeight: 700 }}>🥈 Silver</div>
                        <div style={{ color: "#8181A5", fontSize: 11 }}>500 - 999 poin</div>
                        <div style={{ fontSize: 10, color: "#AAABB0", marginTop: 4 }}>Diskon 5%</div>
                    </div>
                    <div style={{
                        background: "rgba(94, 129, 244, 0.05)",
                        padding: "12px 16px",
                        borderRadius: 12,
                        border: "1px solid rgba(94, 129, 244, 0.2)",
                        textAlign: "center"
                    }}>
                        <div style={{ color: PRIMARY, fontWeight: 700 }}>🥇 Gold</div>
                        <div style={{ color: "#8181A5", fontSize: 11 }}>1000+ poin</div>
                        <div style={{ fontSize: 10, color: "#AAABB0", marginTop: 4 }}>Diskon 10%</div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}