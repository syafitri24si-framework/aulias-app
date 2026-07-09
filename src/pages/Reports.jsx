// src/pages/Reports.jsx - FULL VERSION DENGAN SUPABASE!
import { useState, useEffect, useRef } from "react";
import { 
    FaChartBar, FaUsers, FaExclamationTriangle, FaArrowUp, 
    FaDownload, FaCookie, FaShoppingCart, FaDollarSign,
    FaTruck, FaBan, FaStar, FaCrown, FaMedal, FaTrophy
} from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
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

function HorizontalBar({ data, labels, color = PRIMARY }) {
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
                        data,
                        backgroundColor: data.map((_, i) => 
                            i === 0 ? color : `${color}80`
                        ),
                        borderRadius: 8,
                        barPercentage: 0.7,
                        categoryPercentage: 0.8
                    }]
                },
                options: {
                    indexAxis: "y",
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { 
                            grid: { color: "#F0F0F3" }, 
                            ticks: { color: "#8181A5", font: { size: 11 } } 
                        },
                        y: { 
                            grid: { display: false }, 
                            ticks: { color: "#464A5F", font: { size: 12 } } 
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

    return <canvas ref={canvasRef} style={{ width: "100%", height: 220 }} />;
}

function PieChartSmall({ data, labels, colors }) {
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
                    labels,
                    datasets: [{
                        data,
                        backgroundColor: colors,
                        borderWidth: 0,
                        hoverOffset: 8,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "60%",
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
    }, [data, labels]);

    return <canvas ref={canvasRef} style={{ width: "120px", height: "120px" }} />;
}

// ================================================================
// KOMPONEN METRIC CARD
// ================================================================

function MetricCard({ label, value, sub, color, icon }) {
    return (
        <Card padding="18px 20px">
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ background: color + "15", borderRadius: 12, padding: 10, flexShrink: 0 }}>
                    <span style={{ color, fontSize: 16 }}>{icon}</span>
                </div>
                <div>
                    <div style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginTop: 4 }}>{label}</div>
                    <div style={{ fontSize: 11, color: "#8181A5", marginTop: 2 }}>{sub}</div>
                </div>
            </div>
        </Card>
    );
}

// ================================================================
// MAIN REPORTS
// ================================================================

export default function Reports() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState({
        // Statistik Dasar
        totalTransactions: 0,
        totalRevenue: 0,
        avgOrderValue: 0,
        completed: 0,
        pending: 0,
        cancelled: 0,
        conversionRate: 0,
        totalCustomers: 0,
        goldMembers: 0,
        silverMembers: 0,
        bronzeMembers: 0,
        activeMembers: 0,
        // Top Products
        topProducts: [],
        // Top Customers
        topCustomers: [],
        // Revenue per Method
        revenueByMethod: [],
        // Churn Report
        churnCustomers: [],
        // Tier Distribution
        tierDistribution: [],
        // Monthly Data
        monthlyRevenue: [],
        monthlyOrders: [],
    });

    // ============================================================
    // LOAD DATA
    // ============================================================
    const loadData = async (showLoading = true) => {
        if (showLoading) setRefreshing(true);
        else setLoading(true);

        try {
            console.log("🔄 Loading reports data...");

            const [customers, transactions] = await Promise.all([
                customersAPI.fetchAll(),
                transactionsAPI.fetchAll()
            ]);

            const custData = customers || [];
            const transData = transactions || [];

            // ====== STATISTIK DASAR ======
            const totalTransactions = transData.length;
            const totalRevenue = transData.reduce((sum, t) => sum + (t?.total_belanja || 0), 0);
            const avgOrderValue = totalTransactions ? Math.round(totalRevenue / totalTransactions) : 0;
            const completed = transData.filter(t => t?.status === "Completed").length;
            const pending = transData.filter(t => t?.status === "Pending").length;
            const cancelled = transData.filter(t => t?.status === "Cancelled").length;
            const conversionRate = totalTransactions ? Math.round((completed / totalTransactions) * 100) : 0;
            
            const totalCustomers = custData.length;
            const goldMembers = custData.filter(c => c?.loyalty_tier === "Gold").length;
            const silverMembers = custData.filter(c => c?.loyalty_tier === "Silver").length;
            const bronzeMembers = custData.filter(c => c?.loyalty_tier === "Bronze").length;
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
                .map(([name, count]) => ({ 
                    name, 
                    count,
                    revenue: transData
                        .filter(t => t?.nama_produk?.includes(name))
                        .reduce((sum, t) => sum + (t?.total_belanja || 0), 0)
                }))
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
                    const customerTrans = transData.filter(t => t?.id_customer === id);
                    return {
                        id,
                        name: customer?.nama_lengkap || "Unknown",
                        spent,
                        tier: customer?.loyalty_tier || "None",
                        orders: customerTrans.length,
                        favorite: customer?.produk_favorit || "-"
                    };
                })
                .sort((a, b) => b.spent - a.spent)
                .slice(0, 5);

            // ====== REVENUE PER METHOD ======
            const methodMap = {};
            transData.forEach(t => {
                const method = t?.channel_penjualan || "Offline";
                methodMap[method] = (methodMap[method] || 0) + (t?.total_belanja || 0);
            });
            const revenueByMethod = Object.entries(methodMap)
                .map(([method, revenue]) => ({ method, revenue }))
                .sort((a, b) => b.revenue - a.revenue);

            // ====== CHURN REPORT ======
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const churnCustomers = custData
                .filter(c => {
                    if (!c?.transaksi_terakhir) return true;
                    return new Date(c.transaksi_terakhir) < thirtyDaysAgo;
                })
                .map(c => ({
                    ...c,
                    lastOrder: c?.transaksi_terakhir || "Belum pernah"
                }))
                .slice(0, 5);

            // ====== TIER DISTRIBUTION ======
            const tierMap = {};
            custData.forEach(c => {
                const tier = c?.loyalty_tier || "None";
                if (!tierMap[tier]) tierMap[tier] = { count: 0, totalPoints: 0, totalSpent: 0 };
                tierMap[tier].count++;
                tierMap[tier].totalPoints += (c?.points || 0);
                tierMap[tier].totalSpent += (c?.total_belanja || 0);
            });
            const tierDistribution = Object.entries(tierMap)
                .map(([tier, data]) => ({
                    tier,
                    count: data.count,
                    avgPoints: data.count ? Math.round(data.totalPoints / data.count) : 0,
                    avgSpent: data.count ? Math.round(data.totalSpent / data.count) : 0
                }))
                .sort((a, b) => {
                    const order = { Gold: 1, Silver: 2, Bronze: 3, None: 4 };
                    return (order[a.tier] || 99) - (order[b.tier] || 99);
                });

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

            setStats({
                totalTransactions,
                totalRevenue,
                avgOrderValue,
                completed,
                pending,
                cancelled,
                conversionRate,
                totalCustomers,
                goldMembers,
                silverMembers,
                bronzeMembers,
                activeMembers,
                topProducts,
                topCustomers,
                revenueByMethod,
                churnCustomers,
                tierDistribution,
                monthlyRevenue,
                monthlyOrders,
            });

            console.log("✅ Reports data loaded!");

        } catch (err) {
            console.error("❌ Error loading reports:", err);
        } finally {
            if (showLoading) setRefreshing(false);
            else setLoading(false);
        }
    };

    useEffect(() => {
        loadData(false);
    }, []);

    const handleRefresh = () => {
        loadData(true);
    };

    const handleExport = () => {
        alert("📥 Export laporan sebagai CSV/PDF (fitur coming soon!)");
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
                    <p style={{ color: "#8181A5" }}>Memuat laporan...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: "#F6F6F6", minHeight: "100vh", paddingBottom: 32 }}>
            <PageHeader title="📊 Laporan CRM" breadcrumb={["Dashboard", "Reports"]}>
                <div style={{ display: "flex", gap: 10 }}>
                    <Button type="secondary" onClick={handleRefresh} disabled={refreshing}>
                        {refreshing ? "Memuat..." : "🔄 Refresh"}
                    </Button>
                    <Button type="outline" icon={FaDownload} onClick={handleExport}>
                        Export
                    </Button>
                </div>
            </PageHeader>

            {/* ===== METRIC CARDS ===== */}
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                gap: 12, 
                marginBottom: 20 
            }}>
                <MetricCard 
                    label="Total Transaksi" 
                    value={stats.totalTransactions} 
                    sub="Semua status" 
                    color={PRIMARY} 
                    icon={<FaShoppingCart />} 
                />
                <MetricCard 
                    label="Total Pendapatan" 
                    value={`Rp ${(stats.totalRevenue / 1000000).toFixed(1)}jt`} 
                    sub="Gross revenue" 
                    color={SUCCESS} 
                    icon={<FaDollarSign />} 
                />
                <MetricCard 
                    label="Nilai Order Rata-rata" 
                    value={`Rp ${stats.avgOrderValue.toLocaleString()}`} 
                    sub="Per transaksi" 
                    color="#A78BFA" 
                    icon={<FaChartBar />} 
                />
                <MetricCard 
                    label="Konversi Selesai" 
                    value={`${stats.conversionRate}%`} 
                    sub="Completed / total" 
                    color={WARNING} 
                    icon={<FaArrowUp />} 
                />
                <MetricCard 
                    label="Total Pelanggan" 
                    value={stats.totalCustomers} 
                    sub="Terdaftar" 
                    color="#60A5FA" 
                    icon={<FaUsers />} 
                />
                <MetricCard 
                    label="Member Aktif" 
                    value={stats.activeMembers} 
                    sub={`Gold ${stats.goldMembers} | Silver ${stats.silverMembers} | Bronze ${stats.bronzeMembers}`} 
                    color={PRIMARY} 
                    icon={<FaStar />} 
                />
            </div>

            {/* ===== TOP PRODUCTS + REVENUE BY METHOD ===== */}
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr 1fr", 
                gap: 16, 
                marginBottom: 16 
            }}>
                {/* Top Products */}
                <Card padding="22px 24px">
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>
                        🍞 Produk Terlaris
                    </div>
                    <div style={{ fontSize: 12, color: PRIMARY, marginBottom: 20 }}>
                        Berdasarkan jumlah terjual
                    </div>
                    {stats.topProducts.length === 0 ? (
                        <div style={{ textAlign: "center", color: "#AAABB0", padding: 20 }}>
                            Belum ada data produk
                        </div>
                    ) : (
                        <>
                            <div style={{ height: 200 }}>
                                <HorizontalBar 
                                    data={stats.topProducts.map(p => p.count)} 
                                    labels={stats.topProducts.map(p => p.name)}
                                    color={PRIMARY}
                                />
                            </div>
                            <div style={{ marginTop: 12 }}>
                                {stats.topProducts.map((p, idx) => (
                                    <div key={p.name} style={{ 
                                        display: "flex", 
                                        justifyContent: "space-between", 
                                        padding: "6px 0",
                                        borderBottom: idx < stats.topProducts.length - 1 ? "1px solid #F0F0F3" : "none",
                                        fontSize: 13
                                    }}>
                                        <span>{idx + 1}. {p.name}</span>
                                        <span style={{ fontWeight: 600, color: PRIMARY }}>
                                            {p.count}× (Rp {(p.revenue / 1000).toFixed(0)}rb)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </Card>

                {/* Revenue by Method */}
                <Card padding="22px 24px">
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>
                        💳 Revenue per Metode
                    </div>
                    <div style={{ fontSize: 12, color: PRIMARY, marginBottom: 20 }}>
                        Total pendapatan per channel
                    </div>
                    {stats.revenueByMethod.length === 0 ? (
                        <div style={{ textAlign: "center", color: "#AAABB0", padding: 20 }}>
                            Belum ada data
                        </div>
                    ) : (
                        <>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {stats.revenueByMethod.map((item, idx) => {
                                    const total = stats.totalRevenue || 1;
                                    const pct = Math.round((item.revenue / total) * 100);
                                    const colors = [PRIMARY, "#60A5FA", "#34D399", "#F4BE5E", "#A78BFA"];
                                    return (
                                        <div key={item.method}>
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                                                <span>{item.method || "Offline"}</span>
                                                <span style={{ fontWeight: 600, color: PRIMARY }}>
                                                    Rp {(item.revenue / 1000000).toFixed(1)}jt ({pct}%)
                                                </span>
                                            </div>
                                            <div style={{ 
                                                height: 6, 
                                                background: "#F0F0F3", 
                                                borderRadius: 3, 
                                                overflow: "hidden",
                                                marginTop: 3
                                            }}>
                                                <div style={{
                                                    height: "100%",
                                                    width: `${pct}%`,
                                                    background: colors[idx % colors.length],
                                                    borderRadius: 3,
                                                    transition: "width 0.6s ease"
                                                }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div style={{ 
                                marginTop: 16, 
                                paddingTop: 12, 
                                borderTop: "1px solid #F0F0F3",
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: 12,
                                color: "#8181A5"
                            }}>
                                <span>Total: {stats.revenueByMethod.length} metode</span>
                                <span>Rp {stats.totalRevenue.toLocaleString()}</span>
                            </div>
                        </>
                    )}
                </Card>
            </div>

            {/* ===== TOP CUSTOMERS + TIER DISTRIBUTION ===== */}
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "3fr 2fr", 
                gap: 16, 
                marginBottom: 16 
            }}>
                {/* Top Customers */}
                <Card padding="22px 24px">
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
                        stats.topCustomers.map((c, i) => {
                            const tierColor = { 
                                Gold: PRIMARY, 
                                Silver: "#8181A5", 
                                Bronze: "#F4BE5E", 
                                None: "#AAABB0" 
                            };
                            const initials = c.name?.split(" ").map(w => w[0]).slice(0, 2).join("") || "??";
                            return (
                                <div key={c.id} style={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: 12, 
                                    padding: "8px 0", 
                                    borderBottom: i < stats.topCustomers.length - 1 ? "1px solid #F0F0F3" : "none" 
                                }}>
                                    <div style={{ fontSize: 14, color: PRIMARY, fontWeight: 700, width: 28 }}>{i + 1}</div>
                                    <div style={{ 
                                        width: 36, height: 36, borderRadius: "50%", 
                                        background: "rgba(94, 129, 244, 0.1)", 
                                        display: "flex", alignItems: "center", justifyContent: "center", 
                                        fontSize: 12, fontWeight: 700, color: PRIMARY 
                                    }}>
                                        {initials}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: 13, color: "#1A1A1A" }}>{c.name}</div>
                                        <div style={{ fontSize: 11, color: PRIMARY }}>Rp {c.spent?.toLocaleString() || 0}</div>
                                        <div style={{ fontSize: 10, color: "#AAABB0", marginTop: 2 }}>
                                            {c.orders} order · 🍞 {c.favorite}
                                        </div>
                                    </div>
                                    <span style={{ 
                                        fontSize: 10, fontWeight: 700, 
                                        background: (tierColor[c.tier] || "#AAABB0") + "20", 
                                        color: tierColor[c.tier] || "#AAABB0", 
                                        padding: "4px 10px", borderRadius: 20 
                                    }}>
                                        {c.tier || "None"}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </Card>

                {/* Tier Distribution */}
                <Card padding="22px 24px">
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>
                        🏆 Distribusi Tier
                    </div>
                    <div style={{ fontSize: 12, color: PRIMARY, marginBottom: 16 }}>
                        Jumlah member per tier
                    </div>
                    {stats.tierDistribution.length === 0 ? (
                        <div style={{ textAlign: "center", color: "#AAABB0", padding: 20 }}>
                            Belum ada data tier
                        </div>
                    ) : (
                        stats.tierDistribution.map(t => {
                            const tierConfig = {
                                Gold: { icon: <FaCrown />, color: PRIMARY, bg: "rgba(94, 129, 244, 0.1)" },
                                Silver: { icon: <FaTrophy />, color: "#8181A5", bg: "rgba(129, 129, 165, 0.1)" },
                                Bronze: { icon: <FaMedal />, color: "#F4BE5E", bg: "rgba(244, 190, 94, 0.1)" },
                                None: { icon: <FaStar />, color: "#AAABB0", bg: "rgba(170, 171, 176, 0.1)" },
                            };
                            const config = tierConfig[t.tier] || tierConfig.None;
                            const pct = stats.totalCustomers ? Math.round((t.count / stats.totalCustomers) * 100) : 0;
                            
                            return (
                                <div key={t.tier} style={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: 12,
                                    padding: "8px 0",
                                    borderBottom: "1px solid #F0F0F3"
                                }}>
                                    <div style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: "50%",
                                        background: config.bg,
                                        color: config.color,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 14,
                                        flexShrink: 0
                                    }}>
                                        {config.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <span style={{ fontWeight: 600, fontSize: 13 }}>{t.tier === "None" ? "Non-Member" : t.tier}</span>
                                            <span style={{ fontWeight: 700, color: config.color }}>
                                                {t.count} ({pct}%)
                                            </span>
                                        </div>
                                        <div style={{ fontSize: 11, color: "#8181A5" }}>
                                            ⭐ {t.avgPoints} poin · Rp {(t.avgSpent / 1000).toFixed(0)}rb
                                        </div>
                                        <div style={{ 
                                            height: 4, 
                                            background: "#F0F0F3", 
                                            borderRadius: 2, 
                                            overflow: "hidden",
                                            marginTop: 3
                                        }}>
                                            <div style={{
                                                height: "100%",
                                                width: `${pct}%`,
                                                background: config.color,
                                                borderRadius: 2,
                                                transition: "width 0.6s ease"
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </Card>
            </div>

            {/* ===== CHURN REPORT ===== */}
            <Card padding="22px 24px">
                <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 8, 
                    marginBottom: 16 
                }}>
                    <div style={{ 
                        background: "rgba(244, 190, 94, 0.1)", 
                        borderRadius: 10, 
                        padding: "6px 8px" 
                    }}>
                        <FaExclamationTriangle style={{ color: WARNING, fontSize: 14 }} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>
                            ⚠️ Pelanggan Tidak Aktif (30+ Hari)
                        </div>
                        <div style={{ fontSize: 12, color: PRIMARY }}>
                            Perlu follow-up / promo retensi
                        </div>
                    </div>
                    <span style={{ 
                        marginLeft: "auto",
                        fontSize: 12,
                        color: "#8181A5",
                        background: "#F8F9FC",
                        padding: "4px 12px",
                        borderRadius: 12
                    }}>
                        {stats.churnCustomers.length} pelanggan
                    </span>
                </div>

                {stats.churnCustomers.length === 0 ? (
                    <div style={{ textAlign: "center", color: "#AAABB0", padding: 20 }}>
                        ✅ Semua pelanggan aktif dalam 30 hari terakhir!
                    </div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid #F0F0F3", background: "#FAFBFD" }}>
                                    <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: "#8181A5" }}>Pelanggan</th>
                                    <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: "#8181A5" }}>Tier</th>
                                    <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: "#8181A5" }}>Poin</th>
                                    <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: "#8181A5" }}>Total Belanja</th>
                                    <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: "#8181A5" }}>Order Terakhir</th>
                                    <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: "#8181A5" }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.churnCustomers.map((c, idx) => {
                                    const initials = c.nama_lengkap?.split(" ").map(w => w[0]).slice(0, 2).join("") || "??";
                                    const tierColor = { 
                                        Gold: PRIMARY, 
                                        Silver: "#8181A5", 
                                        Bronze: "#F4BE5E", 
                                        None: "#AAABB0" 
                                    };
                                    return (
                                        <tr key={idx} style={{ borderBottom: "1px solid #F0F0F3" }}>
                                            <td style={{ padding: "10px 14px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    <div style={{ 
                                                        width: 28, height: 28, borderRadius: "50%", 
                                                        background: "rgba(94, 129, 244, 0.1)", 
                                                        display: "flex", alignItems: "center", justifyContent: "center", 
                                                        fontSize: 10, fontWeight: 700, color: PRIMARY 
                                                    }}>
                                                        {initials}
                                                    </div>
                                                    <span style={{ fontWeight: 600, fontSize: 13 }}>{c.nama_lengkap}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: "10px 14px" }}>
                                                <span style={{
                                                    fontSize: 11,
                                                    fontWeight: 600,
                                                    color: tierColor[c.loyalty_tier] || "#AAABB0",
                                                    background: (tierColor[c.loyalty_tier] || "#AAABB0") + "15",
                                                    padding: "2px 10px",
                                                    borderRadius: 12
                                                }}>
                                                    {c.loyalty_tier || "None"}
                                                </span>
                                            </td>
                                            <td style={{ padding: "10px 14px", fontWeight: 600, color: PRIMARY }}>
                                                {c.points || 0}
                                            </td>
                                            <td style={{ padding: "10px 14px" }}>
                                                Rp {c.total_belanja?.toLocaleString() || 0}
                                            </td>
                                            <td style={{ padding: "10px 14px", color: "#8181A5", fontSize: 12 }}>
                                                {c.lastOrder || "Belum pernah"}
                                            </td>
                                            <td style={{ padding: "10px 14px" }}>
                                                <Button type="secondary" size="sm">
                                                    📧 Kirim Promo
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* ===== SUMMARY FOOTER ===== */}
            <div style={{ 
                marginTop: 16,
                background: PRIMARY, 
                borderRadius: 16, 
                padding: "22px 28px", 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                flexWrap: "wrap", 
                gap: 16 
            }}>
                <div>
                    <div style={{ color: "#FFF", fontWeight: 700, fontSize: 16 }}>🍞 Rotte Bakery CRM</div>
                    <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 3 }}>
                        Laporan diperbarui otomatis dari data transaksi
                    </div>
                </div>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                    {[
                        { label: "Revenue Bersih", value: `Rp ${((stats.totalRevenue - (stats.cancelled * stats.avgOrderValue)) / 1000000).toFixed(1)}jt` },
                        { label: "Gold Members", value: stats.goldMembers },
                        { label: "Avg Order", value: `Rp ${(stats.avgOrderValue / 1000).toFixed(0)}rb` },
                        { label: "Konversi", value: `${stats.conversionRate}%` },
                    ].map(s => (
                        <div key={s.label} style={{ textAlign: "center" }}>
                            <div style={{ color: "#FFF", fontWeight: 800, fontSize: 20 }}>{s.value}</div>
                            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 2 }}>{s.label}</div>
                        </div>
                    ))}
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