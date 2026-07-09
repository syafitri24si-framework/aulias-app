// src/pages/Orders.jsx - FULL VERSION (TANPA TAMBAH, TANGGAL OTOMATIS!)
import { useState, useEffect } from "react";
import { FaBoxOpen, FaTrash } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import SearchInput from "../components/SearchInput";
import FilterTabs from "../components/FilterTabs";
import SummaryCard from "../components/SummaryCard";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import { transactionsAPI, customersAPI } from "../services/supabase";

const PRIMARY = "#5E81F4";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("tanggal_transaksi");

    // ============================================================
    // LOAD DATA
    // ============================================================
    const loadData = async () => {
        try {
            setLoading(true);
            const [transData, custData] = await Promise.all([
                transactionsAPI.fetchAll(),
                customersAPI.fetchAll()
            ]);
            setOrders(transData || []);
            setCustomers(custData || []);
        } catch (err) {
            console.error("Error loading orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // ============================================================
    // UPDATE STATUS
    // ============================================================
    const handleStatusChange = async (id, newStatus) => {
        try {
            await transactionsAPI.update(id, { status: newStatus });
            const updated = orders.map(o => 
                o.id_transaksi === id ? { ...o, status: newStatus } : o
            );
            setOrders(updated);
            alert(`✅ Status order ${id} diubah menjadi "${newStatus}"`);
        } catch (err) {
            alert("❌ Gagal update status: " + err.message);
        }
    };

    // ============================================================
    // DELETE ORDER
    // ============================================================
    const handleDeleteOrder = async (id) => {
        if (!window.confirm(`Yakin hapus order ${id}?`)) return;
        try {
            await transactionsAPI.delete(id);
            setOrders(orders.filter(o => o.id_transaksi !== id));
            alert(`✅ Order ${id} berhasil dihapus!`);
        } catch (err) {
            alert("❌ Gagal hapus order: " + err.message);
        }
    };

    // ============================================================
    // FORMAT TANGGAL KE BAHASA INDONESIA
    // ============================================================
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        
        try {
            const date = new Date(dateString);
            
            // Cek apakah tanggal valid
            if (isNaN(date.getTime())) {
                return dateString;
            }
            
            const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
            const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", 
                           "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            
            const dayName = days[date.getDay()];
            const day = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear();
            
            return `${dayName}, ${day} ${month} ${year}`;
        } catch (err) {
            return dateString;
        }
    };

    // ============================================================
    // FILTER & SEARCH
    // ============================================================
    const filtered = orders
        .filter(o => {
            const matchStatus = statusFilter === "All" || o.status === statusFilter;
            const customer = customers.find(c => c.id_customer === o.id_customer);
            const matchSearch = 
                (customer?.nama_lengkap?.toLowerCase().includes(search.toLowerCase())) ||
                (o.id_transaksi?.toLowerCase().includes(search.toLowerCase())) ||
                (o.nama_produk?.toLowerCase().includes(search.toLowerCase()));
            return matchStatus && matchSearch;
        })
        .sort((a, b) => {
            if (sortField === "total_belanja") return b.total_belanja - a.total_belanja;
            if (sortField === "tanggal_transaksi") {
                const dateA = new Date(a.tanggal_transaksi);
                const dateB = new Date(b.tanggal_transaksi);
                return dateB - dateA;
            }
            return 0;
        });

    // ============================================================
    // STATISTIK
    // ============================================================
    const totalRevenue = orders.reduce((s, o) => s + (o.total_belanja || 0), 0);
    const completed = orders.filter(o => o.status === "Completed").length;
    const pending = orders.filter(o => o.status === "Pending").length;
    const cancelled = orders.filter(o => o.status === "Cancelled").length;

    const statusOptions = [
        { value: "All", label: "Semua" },
        { value: "Completed", label: "✅ Completed" },
        { value: "Pending", label: "⏳ Pending" },
        { value: "Cancelled", label: "❌ Cancelled" }
    ];

    if (loading) {
        return (
            <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                minHeight: "60vh" 
            }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        border: "3px solid #E8ECF2",
                        borderTop: `3px solid ${PRIMARY}`,
                        animation: "spin 0.8s linear infinite",
                        margin: "0 auto 12px"
                    }} />
                    <p style={{ color: "#8181A5" }}>Memuat data order...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: "#F6F6F6", minHeight: "100vh", paddingBottom: "32px" }}>
            <PageHeader title="📦 Orders" breadcrumb={["Dashboard", "Orders"]}>
                {/* 🔴 TIDAK ADA TOMBOL TAMBAH ORDER! */}
                <Button 
                    type="secondary" 
                    onClick={loadData}
                    style={{ 
                        background: "#F0F0F3", 
                        color: "#464A5F",
                        border: "none"
                    }}
                >
                    🔄 Refresh
                </Button>
            </PageHeader>

            {/* ===== SUMMARY CARDS ===== */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
                <SummaryCard label="Total Revenue" value={`Rp ${(totalRevenue / 1000000).toFixed(1)}jt`} color={PRIMARY} />
                <SummaryCard label="✅ Completed" value={completed} color="#7CE7AC" />
                <SummaryCard label="⏳ Pending" value={pending} color="#F4BE5E" />
                <SummaryCard label="❌ Cancelled" value={cancelled} color="#FF808B" />
            </div>

            {/* ===== FILTER BAR ===== */}
            <Card padding="16px 20px">
                <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "200px" }}>
                        <SearchInput 
                            value={search} 
                            onChange={setSearch} 
                            placeholder="Cari customer / ID / produk..."
                            onClear={() => setSearch("")}
                        />
                    </div>
                    <FilterTabs options={statusOptions} value={statusFilter} onChange={setStatusFilter} />
                    <select 
                        value={sortField} 
                        onChange={e => setSortField(e.target.value)}
                        style={{ 
                            padding: "10px 14px", 
                            border: "1px solid #E8ECF2", 
                            borderRadius: "12px", 
                            fontSize: "13px", 
                            color: "#464A5F", 
                            outline: "none", 
                            background: "#FAFBFD",
                            fontWeight: 500,
                            cursor: "pointer"
                        }}
                    >
                        <option value="tanggal_transaksi">📅 Terbaru</option>
                        <option value="total_belanja">💰 Harga Tertinggi</option>
                    </select>
                </div>
            </Card>

            {/* ===== TABLE ===== */}
            <div style={{ marginTop: "20px" }}>
                <Card padding="0">
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "#F8F9FC", borderBottom: "1px solid #E8ECF0" }}>
                                    <th style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: PRIMARY }}>ID</th>
                                    <th style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: PRIMARY }}>Customer</th>
                                    <th style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: PRIMARY }}>Items</th>
                                    <th style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: PRIMARY }}>Status</th>
                                    <th style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: PRIMARY }}>Total</th>
                                    <th style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: PRIMARY }}>Tanggal</th>
                                    <th style={{ padding: "14px 20px", textAlign: "center", fontSize: 12, fontWeight: 700, color: PRIMARY }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#AAABB0" }}>
                                            <FaBoxOpen size={32} style={{ display: "block", margin: "0 auto 12px", opacity: 0.3 }} />
                                            Tidak ada order ditemukan
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map(order => {
                                        const customer = customers.find(c => c.id_customer === order.id_customer);
                                        const items = order.nama_produk?.split(',').map(i => i.trim()) || [];
                                        return (
                                            <tr key={order.id_transaksi} style={{ borderBottom: "1px solid #F0F2F5" }}>
                                                <td style={{ padding: "14px 20px", fontFamily: "monospace", fontSize: 13, color: PRIMARY, fontWeight: 600 }}>
                                                    #{order.id_transaksi?.slice(0, 8)}
                                                </td>
                                                <td style={{ padding: "14px 20px", fontWeight: 600, color: "#1A1A1A" }}>
                                                    {customer?.nama_lengkap || "Non-Member"}
                                                </td>
                                                <td style={{ padding: "14px 20px" }}>
                                                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                                        {items.slice(0, 2).map((item, idx) => (
                                                            <span key={idx} style={{ background: "rgba(94, 129, 244, 0.08)", padding: "4px 12px", borderRadius: 20, fontSize: 11, color: PRIMARY }}>
                                                                {item}
                                                            </span>
                                                        ))}
                                                        {items.length > 2 && (
                                                            <span style={{ fontSize: 11, color: "#AAABB0" }}>+{items.length - 2}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td style={{ padding: "14px 20px" }}>
                                                    <select
                                                        value={order.status || "Pending"}
                                                        onChange={(e) => handleStatusChange(order.id_transaksi, e.target.value)}
                                                        style={{
                                                            padding: "6px 12px",
                                                            borderRadius: 20,
                                                            border: "1px solid",
                                                            borderColor: order.status === "Completed" ? "#7CE7AC" :
                                                                       order.status === "Pending" ? "#F4BE5E" : "#FF808B",
                                                            fontSize: 12,
                                                            fontWeight: 600,
                                                            cursor: "pointer",
                                                            background: order.status === "Completed" ? "rgba(124, 231, 172, 0.15)" :
                                                                       order.status === "Pending" ? "rgba(244, 190, 94, 0.15)" :
                                                                       "rgba(255, 128, 139, 0.15)",
                                                            color: order.status === "Completed" ? "#2E7D32" :
                                                                   order.status === "Pending" ? "#E6A017" : "#C62828",
                                                            outline: "none"
                                                        }}
                                                    >
                                                        <option value="Pending">⏳ Pending</option>
                                                        <option value="Completed">✅ Completed</option>
                                                        <option value="Cancelled">❌ Cancelled</option>
                                                    </select>
                                                </td>
                                                <td style={{ padding: "14px 20px", fontWeight: 700, color: PRIMARY, fontSize: 14 }}>
                                                    Rp {order.total_belanja?.toLocaleString() || 0}
                                                </td>
                                                <td style={{ padding: "14px 20px", color: "#8181A5", fontSize: 13 }}>
                                                    {formatDate(order.tanggal_transaksi)}
                                                </td>
                                                <td style={{ padding: "14px 20px", textAlign: "center" }}>
                                                    <button 
                                                        onClick={() => handleDeleteOrder(order.id_transaksi)}
                                                        style={{
                                                            background: "none",
                                                            border: "none",
                                                            cursor: "pointer",
                                                            color: "#FF808B",
                                                            fontSize: 16,
                                                            padding: "4px 8px",
                                                            borderRadius: 6,
                                                            transition: "background 0.2s"
                                                        }}
                                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255, 128, 139, 0.1)"}
                                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* ===== INFO ===== */}
            <div style={{ 
                marginTop: 16, 
                padding: "12px 20px", 
                background: "#FFFFFF", 
                borderRadius: 12, 
                border: "1px solid #F0F0F3",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 12,
                color: "#8181A5"
            }}>
                <span>📊 Menampilkan {filtered.length} dari {orders.length} order</span>
                <span>🔄 Data otomatis sinkron dengan transaksi kasir</span>
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