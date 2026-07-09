// src/pages/Dashboard.jsx - FULL VERSION DENGAN SUPABASE!
import { useState, useEffect, useRef, useCallback } from "react";
import { 
    FaShoppingCart, FaTruck, FaBan, FaDollarSign, 
    FaUsers, FaStar, FaSync, FaArrowUp, FaArrowDown 
} from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import { customersAPI, transactionsAPI } from "../services/supabase";

const PRIMARY = "#5E81F4";
const SUCCESS = "#7CE7AC";
const WARNING = "#F4BE5E";
const ERROR = "#FF808B";

// ================================================================
// KOMPONEN CHART
// ================================================================

function BarChart({ data, labels, label = "Pendapatan (Rp)" }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        
        const loadChart = () => {
            if (!window.Chart) return;
            if (chartRef.current) chartRef.current.destroy();
            
            chartRef.current = new window.Chart(canvasRef.current, {
                type: "bar",
                data: {
                    labels,
                    datasets: [{
                        label: label,
                        data,
                        backgroundColor: data.map((_, i) => 
                            i === data.length - 1 ? PRIMARY : "rgba(94, 129, 244, 0.3)"
                        ),
                        borderRadius: 8,
                        borderSkipped: false,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: "#8181A5", font: { size: 11 } } },
                        y: {
                            grid: { color: "#F0F0F3" },
                            ticks: { color: "#8181A5", font: { size: 11 }, 
                                callback: v => "Rp " + (v / 1000000).toFixed(0) + "jt" 
                            }
                        }
                    }
                }
            });
        };

        if (window.Chart) loadChart();
        else {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
            script.onload = loadChart;
            document.head.appendChild(script);
        }

        return () => { if (chartRef.current) chartRef.current.destroy(); };
    }, [data, labels]);

    return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
}

function LineChart({ data, labels }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        
        const loadChart = () => {
            if (!window.Chart) return;
            if (chartRef.current) chartRef.current.destroy();
            
            chartRef.current = new window.Chart(canvasRef.current, {
                type: "line",
                data: {
                    labels,
                    datasets: [{
                        label: "Orders",
                        data,
                        borderColor: PRIMARY,
                        backgroundColor: "rgba(94, 129, 244, 0.05)",
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: PRIMARY,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: "#8181A5", font: { size: 11 } } },
                        y: { grid: { color: "#F0F0F3" }, ticks: { color: "#8181A5", font: { size: 11 } } }
                    }
                }
            });
        };

        if (window.Chart) loadChart();
        else {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
            script.onload = loadChart;
            document.head.appendChild(script);
        }

        return () => { if (chartRef.current) chartRef.current.destroy(); };
    }, [data, labels]);

    return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
}

function PieChart({ segments }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        
        const loadChart = () => {
            if (!window.Chart) return;
            if (chartRef.current) chartRef.current.destroy();
            
            chartRef.current = new window.Chart(canvasRef.current, {
                type: "doughnut",
                data: {
                    labels: segments.map(s => s.label),
                    datasets: [{
                        data: segments.map(s => s.value),
                        backgroundColor: segments.map(s => s.color),
                        borderWidth: 0,
                        hoverOffset: 8,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "65%",
                    plugins: { legend: { display: false } }
                }
            });
        };

        if (window.Chart) loadChart();
        else {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
            script.onload = loadChart;
            document.head.appendChild(script);
        }

        return () => { if (chartRef.current) chartRef.current.destroy(); };
    }, [segments]);

    return <canvas ref={canvasRef} style={{ width: "160px", height: "160px" }} />;
}

// ================================================================
// KOMPONEN TOP CUSTOMER ITEM
// ================================================================

function TopCustomerItem({ rank, name, spent, tier, favorite }) {
    const tierColor = { 
        Gold: PRIMARY, 
        Silver: "#8181A5", 
        Bronze: "#F4BE5E", 
        None: "#AAABB0" 
    };
    const initials = name?.split(" ").map(w => w[0]).slice(0, 2).join("") || "??";
    
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #F0F0F3" }}>
            <div style={{ fontSize: 14, color: PRIMARY, fontWeight: 700, width: 28 }}>{rank}</div>
            <div style={{ 
                width: 36, height: 36, borderRadius: "50%", 
                background: "rgba(94, 129, 244, 0.1)", 
                display: "flex", alignItems: "center", justifyContent: "center", 
                fontSize: 12, fontWeight: 700, color: PRIMARY 
            }}>
                {initials}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#1A1A1A" }}>{name}</div>
                <div style={{ fontSize: 11, color: PRIMARY }}>Rp {spent?.toLocaleString() || 0}</div>
                <div style={{ fontSize: 10, color: "#AAABB0", marginTop: 2 }}>🍞 {favorite || "-"}</div>
            </div>
            <span style={{ 
                fontSize: 10, fontWeight: 700, 
                background: (tierColor[tier] || "#AAABB0") + "20", 
                color: tierColor[tier] || "#AAABB0", 
                padding: "4px 10px", borderRadius: 20 
            }}>
                {tier || "None"}
            </span>
        </div>
    );
}

// ================================================================
// KOMPONEN RECENT ORDERS
// ================================================================

function RecentOrders({ orders }) {
    const validOrders = Array.isArray(orders) ? orders.filter(o => o && o.id_transaksi) : [];
    
    if (validOrders.length === 0) {
        return <div style={{ padding: 30, textAlign: "center", color: "#AAABB0" }}>Belum ada order</div>;
    }

    return (
        <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ borderBottom: "1px solid #F0F0F3", background: "#FAFBFD" }}>
                        <th style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, color: "#8181A5" }}>ID</th>
                        <th style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, color: "#8181A5" }}>Customer</th>
                        <th style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, color: "#8181A5" }}>Items</th>
                        <th style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, color: "#8181A5" }}>Status</th>
                        <th style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, color: "#8181A5" }}>Total</th>
                        <th style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, color: "#8181A5" }}>Tanggal</th>
                    </tr>
                </thead>
                <tbody>
                    {validOrders.slice(0, 7).map((o, index) => {
                        const items = o?.nama_produk?.split(',').map(i => i.trim()) || [];
                        const customerName = o?.id_customer ? `Customer ${o.id_customer.slice(0, 8)}` : "Non-Member";
                        
                        return (
                            <tr key={o.id_transaksi || index} style={{ borderBottom: "1px solid #F0F0F3" }}>
                                <td style={{ padding: "12px 14px", fontFamily: "monospace", fontSize: 12, color: PRIMARY }}>
                                    #{o.id_transaksi?.slice(0, 8) || "N/A"}
                                </td>
                                <td style={{ padding: "12px 14px", fontWeight: 500, fontSize: 13 }}>
                                    {customerName}
                                </td>
                                <td style={{ padding: "12px 14px" }}>
                                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                        {items.slice(0, 2).map((item, idx) => (
                                            <span key={idx} style={{ 
                                                background: "rgba(94, 129, 244, 0.08)", 
                                                padding: "2px 10px", borderRadius: 12, 
                                                fontSize: 10, color: PRIMARY 
                                            }}>
                                                {item}
                                            </span>
                                        ))}
                                        {items.length > 2 && (
                                            <span style={{ fontSize: 10, color: "#AAABB0" }}>+{items.length - 2}</span>
                                        )}
                                    </div>
                                </td>
                                <td style={{ padding: "12px 14px" }}>
                                    <StatusBadge status={o?.status || "Pending"} />
                                </td>
                                <td style={{ padding: "12px 14px", fontWeight: 600, color: PRIMARY, fontSize: 13 }}>
                                    Rp {o?.total_belanja?.toLocaleString() || 0}
                                </td>
                                <td style={{ padding: "12px 14px", color: "#8181A5", fontSize: 12 }}>
                                    {o?.tanggal_transaksi || "-"}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

// ================================================================
// MAIN DASHBOARD
// ================================================================

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [stats, setStats] = useState({
        totalOrders: 0,
        completed: 0,
        pending: 0,
        cancelled: 0,
        revenue: 0,
        totalCustomers: 0,
        activeMembers: 0,
        topProducts: [],
        topCustomers: [],
        recentOrders: [],
        monthlyRevenue: [0, 0, 0, 0, 0, 0],
        monthlyOrders: [0, 0, 0, 0, 0, 0],
        statusSegments: [
            { label: "Completed", value: 0, color: SUCCESS },
            { label: "Pending", value: 0, color: WARNING },
            { label: "Cancelled", value: 0, color: ERROR },
        ],
    });

    // ============================================================
    // 🔥 FUNGSI LOAD DATA DARI SUPABASE
    // ============================================================
    const loadData = useCallback(async (showLoading = true) => {
        if (showLoading) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        
        try {
            console.log("🔄 Loading dashboard data from Supabase...");
            
            // 🔥 AMBIL DATA DARI SUPABASE!
            const [customers, transactions] = await Promise.all([
                customersAPI.fetchAll(),
                transactionsAPI.fetchAll()
            ]);

            console.log("📊 Customers:", customers?.length || 0);
            console.log("📊 Transactions:", transactions?.length || 0);

            const custData = customers || [];
            const transData = transactions || [];

            // ====== STATISTIK DASAR ======
            const totalOrders = transData.length;
            const completed = transData.filter(t => t?.status === "Completed").length;
            const pending = transData.filter(t => t?.status === "Pending").length;
            const cancelled = transData.filter(t => t?.status === "Cancelled").length;
            const revenue = transData.reduce((sum, t) => sum + (t?.total_belanja || 0), 0);
            const activeMembers = custData.filter(c => c?.loyalty_tier !== "None" && c?.points > 0).length;

            // ====== TOP PRODUCTS ======
            const productCount = {};
            transData.forEach(t => {
                const items = t?.nama_produk?.split(',').map(i => i.trim()) || [];
                items.forEach(item => {
                    if (item) productCount[item] = (productCount[item] || 0) + 1;
                });
            });
            const topProducts = Object.entries(productCount)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            // ====== TOP CUSTOMERS ======
            const customerSpent = {};
            transData.forEach(t => {
                if (t?.id_customer) {
                    customerSpent[t.id_customer] = (customerSpent[t.id_customer] || 0) + (t?.total_belanja || 0);
                }
            });
            const topCustomers = Object.entries(customerSpent)
                .map(([id, spent]) => {
                    const customer = custData.find(c => c?.id_customer === id);
                    return {
                        id,
                        name: customer?.nama_lengkap || "Unknown",
                        spent,
                        tier: customer?.loyalty_tier || "None",
                        favorite: customer?.produk_favorit || "-"
                    };
                })
                .sort((a, b) => b.spent - a.spent)
                .slice(0, 5);

            // ====== MONTHLY DATA ======
            const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];
            const monthlyRevenue = months.map((_, idx) => {
                const month = idx + 1;
                return transData
                    .filter(t => {
                        if (!t?.tanggal_transaksi) return false;
                        const d = new Date(t.tanggal_transaksi);
                        return d.getMonth() === month - 1;
                    })
                    .reduce((sum, t) => sum + (t?.total_belanja || 0), 0);
            });
            
            const monthlyOrders = months.map((_, idx) => {
                const month = idx + 1;
                return transData
                    .filter(t => {
                        if (!t?.tanggal_transaksi) return false;
                        const d = new Date(t.tanggal_transaksi);
                        return d.getMonth() === month - 1;
                    })
                    .length;
            });

            // ====== STATUS SEGMENTS ======
            const statusSegments = [
                { label: "Completed", value: completed, color: SUCCESS },
                { label: "Pending", value: pending, color: WARNING },
                { label: "Cancelled", value: cancelled, color: ERROR },
            ];

            // ====== RECENT ORDERS ======
            const recentOrders = transData
                .filter(t => t?.tanggal_transaksi)
                .sort((a, b) => new Date(b.tanggal_transaksi) - new Date(a.tanggal_transaksi))
                .slice(0, 7);

            setStats({
                totalOrders,
                completed,
                pending,
                cancelled,
                revenue,
                totalCustomers: custData.length,
                activeMembers,
                topProducts,
                topCustomers,
                recentOrders,
                monthlyRevenue,
                monthlyOrders,
                statusSegments,
            });

            setLastUpdated(new Date().toLocaleTimeString());
            console.log("✅ Dashboard data loaded!");

        } catch (err) {
            console.error("❌ Error loading dashboard:", err);
        } finally {
            if (showLoading) {
                setRefreshing(false);
            } else {
                setLoading(false);
            }
        }
    }, []);

    // ============================================================
    // LOAD DATA SAAT PERTAMA KALI
    // ============================================================
    useEffect(() => {
        loadData(false);
    }, [loadData]);

    // ============================================================
    // AUTO REFRESH SETIAP 30 DETIK
    // ============================================================
    useEffect(() => {
        const interval = setInterval(() => {
            console.log("🔄 Auto-refresh dashboard...");
            loadData(true);
        }, 30000);

        return () => clearInterval(interval);
    }, [loadData]);

    // ============================================================
    // MANUAL REFRESH
    // ============================================================
    const handleRefresh = () => {
        loadData(true);
    };

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
                    <p style={{ color: "#8181A5" }}>Memuat dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: "#F6F6F6", minHeight: "100vh", paddingBottom: 32 }}>
            <PageHeader title="Dashboard" breadcrumb={["Home"]}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {lastUpdated && (
                        <span style={{ 
                            fontSize: 11, 
                            color: "#8181A5",
                            background: "#F0F0F3",
                            padding: "4px 12px",
                            borderRadius: 12
                        }}>
                            🕐 {lastUpdated}
                        </span>
                    )}
                    <button 
                        onClick={handleRefresh}
                        disabled={refreshing}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "8px 16px",
                            background: PRIMARY,
                            color: "#FFF",
                            border: "none",
                            borderRadius: 8,
                            cursor: refreshing ? "not-allowed" : "pointer",
                            fontWeight: 600,
                            fontSize: 13,
                            opacity: refreshing ? 0.6 : 1,
                            transition: "all 0.2s"
                        }}
                        onMouseEnter={e => {
                            if (!refreshing) e.currentTarget.style.background = "#1B51E5";
                        }}
                        onMouseLeave={e => {
                            if (!refreshing) e.currentTarget.style.background = PRIMARY;
                        }}
                    >
                        <FaSync style={{ 
                            animation: refreshing ? "spin 0.8s linear infinite" : "none" 
                        }} />
                        {refreshing ? "Memuat..." : "Refresh"}
                    </button>
                </div>
            </PageHeader>

            {/* ===== STAT CARDS ===== */}
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
                gap: 16, 
                marginBottom: 24 
            }}>
                <StatCard icon={<FaShoppingCart />} label="Total Orders" value={stats.totalOrders} />
                <StatCard icon={<FaTruck />} label="Completed" value={stats.completed} />
                <StatCard icon={<FaBan />} label="Cancelled" value={stats.cancelled} />
                <StatCard icon={<FaDollarSign />} label="Revenue" value={`Rp ${(stats.revenue / 1000000).toFixed(1)}jt`} />
                <StatCard icon={<FaUsers />} label="Customers" value={stats.totalCustomers} />
                <StatCard icon={<FaStar />} label="Active Members" value={stats.activeMembers} />
            </div>

            {/* ===== TOP PRODUCTS ===== */}
            <div style={{ marginBottom: 16 }}>
                <Card padding="20px 24px">
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>
                        🍞 Top 5 Produk Terlaris
                    </div>
                    <div style={{ fontSize: 12, color: PRIMARY, marginBottom: 20 }}>
                        Berdasarkan jumlah pesanan
                    </div>
                    
                    {stats.topProducts.length === 0 ? (
                        <div style={{ textAlign: "center", color: "#AAABB0", padding: 20 }}>
                            Belum ada data produk
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div>
                                {stats.topProducts.map((p, idx) => (
                                    <div key={p.name} style={{ marginBottom: 12 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                            <span style={{ fontSize: 13, color: "#464A5F" }}>
                                                {idx + 1}. {p.name}
                                            </span>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: PRIMARY }}>
                                                {p.count}×
                                            </span>
                                        </div>
                                        <div style={{ 
                                            height: 6, 
                                            background: "#F0F0F3", 
                                            borderRadius: 3, 
                                            overflow: "hidden" 
                                        }}>
                                            <div style={{
                                                height: "100%",
                                                width: `${(p.count / (stats.topProducts[0]?.count || 1)) * 100}%`,
                                                background: PRIMARY,
                                                borderRadius: 3,
                                                transition: "width 0.6s ease"
                                            }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ height: 180 }}>
                                <BarChart 
                                    data={stats.topProducts.map(p => p.count)} 
                                    labels={stats.topProducts.map(p => p.name)}
                                    label="Jumlah Terjual"
                                />
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            {/* ===== CHART ROW ===== */}
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "2fr 1fr", 
                gap: 16, 
                marginBottom: 16 
            }}>
                <Card padding="20px 24px">
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>
                        📊 Pendapatan Bulanan
                    </div>
                    <div style={{ fontSize: 12, color: PRIMARY, marginBottom: 20 }}>
                        6 bulan terakhir
                    </div>
                    <div style={{ height: 200 }}>
                        <BarChart 
                            data={stats.monthlyRevenue} 
                            labels={["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"]}
                        />
                    </div>
                </Card>

                <Card padding="20px 24px">
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>
                        🎯 Status Order
                    </div>
                    <div style={{ fontSize: 12, color: PRIMARY, marginBottom: 16 }}>
                        Distribusi semua order
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                        <PieChart segments={stats.statusSegments} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {stats.statusSegments.map(seg => (
                            <div key={seg.label} style={{ 
                                display: "flex", 
                                justifyContent: "space-between", 
                                alignItems: "center",
                                fontSize: 12 
                            }}>
                                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ 
                                        width: 10, height: 10, borderRadius: 2, 
                                        background: seg.color 
                                    }} />
                                    <span style={{ color: "#8181A5" }}>{seg.label}</span>
                                </span>
                                <span style={{ fontWeight: 600, color: "#1A1A1A" }}>{seg.value}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* ===== TREN ORDER + TOP CUSTOMERS ===== */}
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "3fr 2fr", 
                gap: 16, 
                marginBottom: 16 
            }}>
                <Card padding="20px 24px">
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>
                        📈 Tren Order
                    </div>
                    <div style={{ fontSize: 12, color: PRIMARY, marginBottom: 20 }}>
                        Jumlah order per bulan
                    </div>
                    <div style={{ height: 180 }}>
                        <LineChart 
                            data={stats.monthlyOrders} 
                            labels={["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"]}
                        />
                    </div>
                </Card>

                <Card padding="20px 24px">
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>
                        ⭐ Top Pelanggan
                    </div>
                    <div style={{ fontSize: 12, color: PRIMARY, marginBottom: 16 }}>
                        Berdasarkan total belanja
                    </div>
                    {stats.topCustomers.length === 0 ? (
                        <div style={{ textAlign: "center", color: "#AAABB0", padding: 20 }}>
                            Belum ada data pelanggan
                        </div>
                    ) : (
                        stats.topCustomers.map((c, i) => (
                            <TopCustomerItem 
                                key={c.id} 
                                rank={i + 1} 
                                name={c.name} 
                                spent={c.spent} 
                                tier={c.tier} 
                                favorite={c.favorite} 
                            />
                        ))
                    )}
                </Card>
            </div>

            {/* ===== RECENT ORDERS ===== */}
            <Card padding="0">
                <div style={{ 
                    padding: "16px 24px", 
                    borderBottom: "1px solid #F0F0F3", 
                    fontWeight: 700, 
                    fontSize: 15, 
                    color: "#1A1A1A" 
                }}>
                    📦 Order Terbaru
                </div>
                <RecentOrders orders={stats.recentOrders} />
            </Card>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}