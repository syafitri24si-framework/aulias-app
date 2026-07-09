// src/pages/CustomerDetail.jsx - FULL VERSION DENGAN SUPABASE!
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
    FaArrowLeft, FaEnvelope, FaPhone, FaCalendarAlt, 
    FaMapMarkerAlt, FaBirthdayCake, FaCrown, FaMedal, 
    FaTrophy, FaUser, FaStar, FaHistory, FaShoppingBag,
    FaPrint, FaDownload, FaEdit, FaTrash
} from "react-icons/fa";
import Avatar from "../components/Avatar";
import TierBadge from "../components/TierBadge";
import StatusBadge from "../components/StatusBadge";
import Card from "../components/Card";
import Container from "../components/Container";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";
import { customersAPI, transactionsAPI } from "../services/supabase";

const PRIMARY = "#5E81F4";
const SUCCESS = "#7CE7AC";
const WARNING = "#F4BE5E";
const ERROR = "#FF808B";

// ================================================================
// TIER CONFIG
// ================================================================
const TIER_STYLE = {
    Gold: { 
        bg: "rgba(94, 129, 244, 0.1)", 
        color: PRIMARY, 
        label: "🥇 Gold Member",
        icon: <FaCrown size={20} />
    },
    Silver: { 
        bg: "rgba(129, 129, 165, 0.1)", 
        color: "#8181A5", 
        label: "🥈 Silver Member",
        icon: <FaTrophy size={20} />
    },
    Bronze: { 
        bg: "rgba(244, 190, 94, 0.1)", 
        color: "#F4BE5E", 
        label: "🥉 Bronze Member",
        icon: <FaMedal size={20} />
    },
    None: { 
        bg: "rgba(170, 171, 176, 0.1)", 
        color: "#AAABB0", 
        label: "👤 Non Member",
        icon: <FaUser size={20} />
    }
};

// ================================================================
// MAIN COMPONENT
// ================================================================
export default function CustomerDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // ============================================================
    // LOAD DATA
    // ============================================================
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                // Ambil data customer
                const customerData = await customersAPI.fetchById(id);
                
                if (!customerData) {
                    setError("Customer tidak ditemukan");
                    setLoading(false);
                    return;
                }

                setCustomer(customerData);

                // Ambil transaksi customer
                const transData = await transactionsAPI.fetchByCustomer(id);
                setTransactions(transData || []);

            } catch (err) {
                console.error("Error loading customer detail:", err);
                setError("Gagal memuat data customer");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    // ============================================================
    // FORMAT TANGGAL
    // ============================================================
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });
        } catch {
            return dateString;
        }
    };

    // ============================================================
    // DELETE CUSTOMER
    // ============================================================
    const handleDelete = async () => {
        if (!window.confirm(`Yakin hapus customer "${customer?.nama_lengkap}"?`)) return;
        try {
            await customersAPI.delete(id);
            alert("✅ Customer berhasil dihapus!");
            navigate("/customers");
        } catch (err) {
            alert("❌ Gagal menghapus customer: " + err.message);
        }
    };

    // ============================================================
    // EXPORT TRANSACTIONS
    // ============================================================
    const exportTransactions = () => {
        if (transactions.length === 0) {
            alert("Tidak ada transaksi untuk diexport.");
            return;
        }
        const csvContent = [
            ["ID", "Tanggal", "Produk", "Total", "Status", "Poin"],
            ...transactions.map(t => [
                t.id_transaksi,
                t.tanggal_transaksi,
                t.nama_produk,
                t.total_belanja,
                t.status,
                t.poin_didapat || 0
            ])
        ].map(row => row.join(",")).join("\n");
        
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `transactions_${customer?.nama_lengkap?.replace(/\s/g, "_")}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // ============================================================
    // PRINT
    // ============================================================
    const handlePrint = () => {
        window.print();
    };

    // ============================================================
    // LOADING
    // ============================================================
    if (loading) {
        return <LoadingSpinner fullScreen text="Memuat data customer..." />;
    }

    // ============================================================
    // ERROR
    // ============================================================
    if (error || !customer) {
        return (
            <Container>
                <div style={{ 
                    textAlign: "center", 
                    padding: "60px 20px",
                    background: "#FFFFFF",
                    borderRadius: 20,
                    border: "1px solid #F0F0F3"
                }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
                    <h2 style={{ color: "#1A1A1A" }}>Customer Tidak Ditemukan</h2>
                    <p style={{ color: "#8181A5" }}>{error || "Data customer tidak ada"}</p>
                    <Link to="/customers" style={{ 
                        display: "inline-block",
                        marginTop: 16,
                        color: PRIMARY,
                        textDecoration: "none",
                        fontWeight: 600
                    }}>
                        ← Kembali ke daftar customer
                    </Link>
                </div>
            </Container>
        );
    }

    // ============================================================
    // STATISTICS
    // ============================================================
    const totalOrders = transactions.length;
    const totalSpent = transactions.reduce((sum, t) => sum + t.total_belanja, 0);
    const completedOrders = transactions.filter(t => t.status === "Completed").length;
    const pendingOrders = transactions.filter(t => t.status === "Pending").length;
    const cancelledOrders = transactions.filter(t => t.status === "Cancelled").length;
    const totalPoints = customer.points || 0;

    // Favorite product
    const productCount = {};
    transactions.forEach(t => {
        const products = t.nama_produk?.split(',').map(p => p.trim()) || [];
        products.forEach(p => {
            productCount[p] = (productCount[p] || 0) + 1;
        });
    });
    const favoriteProduct = Object.entries(productCount).sort((a, b) => b[1] - a[1])[0];
    const favoriteName = favoriteProduct ? favoriteProduct[0] : "-";
    const favoriteCount = favoriteProduct ? favoriteProduct[1] : 0;

    const tierInfo = TIER_STYLE[customer.loyalty_tier] || TIER_STYLE.None;

    // ============================================================
    // RENDER
    // ============================================================
    return (
        <div style={{ background: "#F6F6F6", minHeight: "100vh", paddingBottom: 32 }}>
            {/* ===== HEADER ===== */}
            <div style={{ 
                padding: "20px 24px 0 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12
            }}>
                <Link to="/customers" style={{ 
                    display: "inline-flex", 
                    alignItems: "center", 
                    gap: 8, 
                    color: PRIMARY, 
                    textDecoration: "none", 
                    fontSize: 14, 
                    fontWeight: 600 
                }}>
                    <FaArrowLeft size={12} /> Kembali ke Customers
                </Link>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Button type="secondary" size="sm" onClick={handlePrint} icon={FaPrint}>
                        Print
                    </Button>
                    <Button type="secondary" size="sm" onClick={exportTransactions} icon={FaDownload}>
                        Export
                    </Button>
                    <Button type="danger" size="sm" onClick={handleDelete} icon={FaTrash}>
                        Hapus
                    </Button>
                </div>
            </div>

            {/* ===== MAIN CONTENT ===== */}
            <Container maxWidth="1100px" padding="0 24px">
                {/* ===== PROFIL CARD ===== */}
                <Card padding="28px 32px" style={{ marginTop: 20 }}>
                    <div style={{ 
                        display: "flex", 
                        gap: 24, 
                        flexWrap: "wrap", 
                        alignItems: "flex-start" 
                    }}>
                        {/* Avatar */}
                        <div style={{ 
                            display: "flex", 
                            flexDirection: "column", 
                            alignItems: "center",
                            gap: 8
                        }}>
                            <Avatar name={customer.nama_lengkap} size="xl" />
                            <span style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                background: tierInfo.bg,
                                color: tierInfo.color,
                                padding: "4px 14px",
                                borderRadius: 20,
                                fontSize: 12,
                                fontWeight: 700,
                                border: `1px solid ${tierInfo.color}30`
                            }}>
                                {tierInfo.icon} {tierInfo.label}
                            </span>
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1 }}>
                            <div style={{ 
                                display: "flex", 
                                justifyContent: "space-between", 
                                alignItems: "flex-start",
                                flexWrap: "wrap",
                                gap: 8
                            }}>
                                <div>
                                    <h1 style={{ 
                                        margin: 0, 
                                        fontSize: 28, 
                                        color: "#1A1A1A",
                                        fontWeight: 800
                                    }}>
                                        {customer.nama_lengkap}
                                    </h1>
                                    <p style={{ 
                                        color: "#8181A5", 
                                        marginBottom: 12,
                                        fontSize: 13
                                    }}>
                                        ID: {customer.id_customer}
                                    </p>
                                </div>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <Button 
                                        type="primary" 
                                        size="sm" 
                                        icon={FaEdit}
                                        onClick={() => navigate(`/customers/edit/${customer.id_customer}`)}
                                    >
                                        Edit
                                    </Button>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div style={{ 
                                display: "grid", 
                                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                gap: 12,
                                marginBottom: 16
                            }}>
                                <div style={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: 8, 
                                    color: "#464A5F", 
                                    fontSize: 13,
                                    background: "#F8F9FC",
                                    padding: "8px 14px",
                                    borderRadius: 10
                                }}>
                                    <FaEnvelope style={{ color: PRIMARY }} />
                                    {customer.email || "-"}
                                </div>
                                <div style={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: 8, 
                                    color: "#464A5F", 
                                    fontSize: 13,
                                    background: "#F8F9FC",
                                    padding: "8px 14px",
                                    borderRadius: 10
                                }}>
                                    <FaPhone style={{ color: PRIMARY }} />
                                    {customer.no_handphone || "-"}
                                </div>
                                <div style={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: 8, 
                                    color: "#464A5F", 
                                    fontSize: 13,
                                    background: "#F8F9FC",
                                    padding: "8px 14px",
                                    borderRadius: 10
                                }}>
                                    <FaMapMarkerAlt style={{ color: PRIMARY }} />
                                    {customer.alamat || "-"}
                                </div>
                                <div style={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: 8, 
                                    color: "#464A5F", 
                                    fontSize: 13,
                                    background: "#F8F9FC",
                                    padding: "8px 14px",
                                    borderRadius: 10
                                }}>
                                    <FaBirthdayCake style={{ color: PRIMARY }} />
                                    {customer.tanggal_lahir ? formatDate(customer.tanggal_lahir) : "-"}
                                </div>
                                <div style={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: 8, 
                                    color: "#464A5F", 
                                    fontSize: 13,
                                    background: "#F8F9FC",
                                    padding: "8px 14px",
                                    borderRadius: 10
                                }}>
                                    <FaCalendarAlt style={{ color: PRIMARY }} />
                                    Bergabung: {formatDate(customer.join_date)}
                                </div>
                            </div>

                            {/* Favorite Product */}
                            <div style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                background: "rgba(94, 129, 244, 0.05)",
                                padding: "6px 16px",
                                borderRadius: 20,
                                border: "1px solid rgba(94, 129, 244, 0.1)"
                            }}>
                                <span style={{ fontSize: 13, color: "#8181A5" }}>🍞 Produk Favorit:</span>
                                <span style={{ fontWeight: 700, color: PRIMARY }}>
                                    {favoriteName} {favoriteCount > 0 && `(${favoriteCount}x)`}
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* ===== STATS ROW ===== */}
                <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", 
                    gap: 16, 
                    margin: "16px 0" 
                }}>
                    <Card padding="18px 20px">
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 32, fontWeight: 800, color: PRIMARY }}>
                                {totalOrders}
                            </div>
                            <div style={{ fontSize: 13, color: "#8181A5" }}>Total Order</div>
                        </div>
                    </Card>
                    <Card padding="18px 20px">
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 32, fontWeight: 800, color: PRIMARY }}>
                                Rp {totalSpent.toLocaleString()}
                            </div>
                            <div style={{ fontSize: 13, color: "#8181A5" }}>Total Belanja</div>
                        </div>
                    </Card>
                    <Card padding="18px 20px">
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 32, fontWeight: 800, color: PRIMARY }}>
                                {totalPoints}
                            </div>
                            <div style={{ fontSize: 13, color: "#8181A5" }}>Poin Loyalty</div>
                        </div>
                    </Card>
                    <Card padding="18px 20px">
                        <div style={{ textAlign: "center" }}>
                            <div style={{ 
                                fontSize: 32, 
                                fontWeight: 800, 
                                color: completedOrders === totalOrders ? SUCCESS : PRIMARY 
                            }}>
                                {completedOrders}/{totalOrders}
                            </div>
                            <div style={{ fontSize: 13, color: "#8181A5" }}>Order Selesai</div>
                        </div>
                    </Card>
                </div>

                {/* ===== ORDER STATUS SUMMARY ===== */}
                <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(3, 1fr)", 
                    gap: 12,
                    marginBottom: 16
                }}>
                    <div style={{
                        background: "rgba(124, 231, 172, 0.08)",
                        padding: "12px 16px",
                        borderRadius: 12,
                        textAlign: "center",
                        border: "1px solid rgba(124, 231, 172, 0.2)"
                    }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: SUCCESS }}>
                            {completedOrders}
                        </div>
                        <div style={{ fontSize: 12, color: "#8181A5" }}>✅ Completed</div>
                    </div>
                    <div style={{
                        background: "rgba(244, 190, 94, 0.08)",
                        padding: "12px 16px",
                        borderRadius: 12,
                        textAlign: "center",
                        border: "1px solid rgba(244, 190, 94, 0.2)"
                    }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: WARNING }}>
                            {pendingOrders}
                        </div>
                        <div style={{ fontSize: 12, color: "#8181A5" }}>⏳ Pending</div>
                    </div>
                    <div style={{
                        background: "rgba(255, 128, 139, 0.08)",
                        padding: "12px 16px",
                        borderRadius: 12,
                        textAlign: "center",
                        border: "1px solid rgba(255, 128, 139, 0.2)"
                    }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: ERROR }}>
                            {cancelledOrders}
                        </div>
                        <div style={{ fontSize: 12, color: "#8181A5" }}>❌ Cancelled</div>
                    </div>
                </div>

                {/* ===== TRANSACTION HISTORY ===== */}
                <Card padding="0">
                    <div style={{ 
                        padding: "18px 24px", 
                        borderBottom: "1px solid #F0F0F3", 
                        fontWeight: 700, 
                        color: "#1A1A1A",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <span>🛒 Riwayat Order</span>
                        <span style={{ 
                            fontSize: 12, 
                            color: "#8181A5", 
                            fontWeight: 400,
                            background: "#F8F9FC",
                            padding: "4px 12px",
                            borderRadius: 12
                        }}>
                            {transactions.length} transaksi
                        </span>
                    </div>

                    {transactions.length === 0 ? (
                        <div style={{ 
                            padding: "60px 20px", 
                            textAlign: "center", 
                            color: "#AAABB0" 
                        }}>
                            <FaHistory size={32} style={{ 
                                display: "block", 
                                margin: "0 auto 12px", 
                                opacity: 0.3 
                            }} />
                            <p>Belum ada order dari customer ini</p>
                            <p style={{ fontSize: 12 }}>Customer belum melakukan pembelian</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ 
                                        background: "#F8F9FC", 
                                        borderBottom: "1px solid #F0F0F3" 
                                    }}>
                                        <th style={{ 
                                            padding: "12px 16px", 
                                            textAlign: "left", 
                                            fontSize: 11, 
                                            color: "#8181A5" 
                                        }}>ID</th>
                                        <th style={{ 
                                            padding: "12px 16px", 
                                            textAlign: "left", 
                                            fontSize: 11, 
                                            color: "#8181A5" 
                                        }}>Tanggal</th>
                                        <th style={{ 
                                            padding: "12px 16px", 
                                            textAlign: "left", 
                                            fontSize: 11, 
                                            color: "#8181A5" 
                                        }}>Produk</th>
                                        <th style={{ 
                                            padding: "12px 16px", 
                                            textAlign: "left", 
                                            fontSize: 11, 
                                            color: "#8181A5" 
                                        }}>Qty</th>
                                        <th style={{ 
                                            padding: "12px 16px", 
                                            textAlign: "left", 
                                            fontSize: 11, 
                                            color: "#8181A5" 
                                        }}>Total</th>
                                        <th style={{ 
                                            padding: "12px 16px", 
                                            textAlign: "left", 
                                            fontSize: 11, 
                                            color: "#8181A5" 
                                        }}>Poin</th>
                                        <th style={{ 
                                            padding: "12px 16px", 
                                            textAlign: "left", 
                                            fontSize: 11, 
                                            color: "#8181A5" 
                                        }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((t, idx) => {
                                        const products = t.nama_produk?.split(',').map(p => p.trim()) || [];
                                        return (
                                            <tr key={t.id_transaksi || idx} style={{ 
                                                borderBottom: "1px solid #F0F0F3" 
                                            }}>
                                                <td style={{ 
                                                    padding: "12px 16px", 
                                                    fontFamily: "monospace", 
                                                    fontSize: 12, 
                                                    color: PRIMARY,
                                                    fontWeight: 600
                                                }}>
                                                    #{t.id_transaksi?.slice(0, 8)}
                                                </td>
                                                <td style={{ 
                                                    padding: "12px 16px", 
                                                    color: "#8181A5", 
                                                    fontSize: 12 
                                                }}>
                                                    {formatDate(t.tanggal_transaksi)}
                                                </td>
                                                <td style={{ padding: "12px 16px" }}>
                                                    <div style={{ 
                                                        display: "flex", 
                                                        gap: 4, 
                                                        flexWrap: "wrap" 
                                                    }}>
                                                        {products.slice(0, 3).map((item, i) => (
                                                            <span key={i} style={{ 
                                                                background: "rgba(94, 129, 244, 0.08)", 
                                                                padding: "2px 10px", 
                                                                borderRadius: 12, 
                                                                fontSize: 11, 
                                                                color: PRIMARY 
                                                            }}>
                                                                {item}
                                                            </span>
                                                        ))}
                                                        {products.length > 3 && (
                                                            <span style={{ 
                                                                fontSize: 11, 
                                                                color: "#AAABB0" 
                                                            }}>
                                                                +{products.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td style={{ 
                                                    padding: "12px 16px", 
                                                    textAlign: "center",
                                                    fontSize: 12 
                                                }}>
                                                    {t.qty || products.length}
                                                </td>
                                                <td style={{ 
                                                    padding: "12px 16px", 
                                                    fontWeight: 700, 
                                                    color: PRIMARY,
                                                    fontSize: 13 
                                                }}>
                                                    Rp {t.total_belanja?.toLocaleString() || 0}
                                                </td>
                                                <td style={{ 
                                                    padding: "12px 16px", 
                                                    fontWeight: 600, 
                                                    color: SUCCESS,
                                                    fontSize: 12 
                                                }}>
                                                    +{t.poin_didapat || 0}
                                                </td>
                                                <td style={{ padding: "12px 16px" }}>
                                                    <StatusBadge status={t.status || "Completed"} />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>

                {/* ===== TIER INFO ===== */}
                <div style={{ 
                    marginTop: 16,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 12,
                    fontSize: 12
                }}>
                    <div style={{
                        background: "rgba(244, 190, 94, 0.05)",
                        padding: "14px 16px",
                        borderRadius: 12,
                        border: "1px solid rgba(244, 190, 94, 0.2)",
                        textAlign: "center"
                    }}>
                        <div style={{ color: "#F4BE5E", fontWeight: 700, fontSize: 14 }}>🥉 Bronze</div>
                        <div style={{ color: "#8181A5", fontSize: 11 }}>0 - 499 poin</div>
                        <div style={{ fontSize: 10, color: "#AAABB0", marginTop: 4 }}>
                            {customer.loyalty_tier === "Bronze" ? "✅ Tier saat ini" : "Poin dasar"}
                        </div>
                    </div>
                    <div style={{
                        background: "rgba(129, 129, 165, 0.05)",
                        padding: "14px 16px",
                        borderRadius: 12,
                        border: "1px solid rgba(129, 129, 165, 0.2)",
                        textAlign: "center"
                    }}>
                        <div style={{ color: "#8181A5", fontWeight: 700, fontSize: 14 }}>🥈 Silver</div>
                        <div style={{ color: "#8181A5", fontSize: 11 }}>500 - 999 poin</div>
                        <div style={{ fontSize: 10, color: "#AAABB0", marginTop: 4 }}>
                            {customer.loyalty_tier === "Silver" ? "✅ Tier saat ini" : "Diskon 5%"}
                        </div>
                    </div>
                    <div style={{
                        background: "rgba(94, 129, 244, 0.05)",
                        padding: "14px 16px",
                        borderRadius: 12,
                        border: "1px solid rgba(94, 129, 244, 0.2)",
                        textAlign: "center"
                    }}>
                        <div style={{ color: PRIMARY, fontWeight: 700, fontSize: 14 }}>🥇 Gold</div>
                        <div style={{ color: "#8181A5", fontSize: 11 }}>1000+ poin</div>
                        <div style={{ fontSize: 10, color: "#AAABB0", marginTop: 4 }}>
                            {customer.loyalty_tier === "Gold" ? "✅ Tier saat ini" : "Diskon 10%"}
                        </div>
                    </div>
                </div>

                {/* ===== ACTION BUTTONS ===== */}
                <div style={{ 
                    marginTop: 20,
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                    justifyContent: "center"
                }}>
                    <Button 
                        type="primary" 
                        onClick={() => navigate("/transactions")}
                    >
                        🛒 Buat Transaksi
                    </Button>
                    <Button 
                        type="secondary" 
                        onClick={() => navigate("/orders")}
                    >
                        📦 Lihat Semua Order
                    </Button>
                    <Button 
                        type="outline" 
                        onClick={() => navigate(`/customers/edit/${customer.id_customer}`)}
                    >
                        ✏️ Edit Profil
                    </Button>
                </div>
            </Container>

            {/* ===== PRINT STYLES ===== */}
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; }
                    .print-card { box-shadow: none !important; border: 1px solid #ddd !important; }
                }
            `}</style>
        </div>
    );
}