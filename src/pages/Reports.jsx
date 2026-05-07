import { useEffect, useRef } from "react";
import { FaChartBar, FaUsers, FaExclamationTriangle, FaArrowUp, FaDownload, FaCookie } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import customers from "../data/customers";
import orders from "../data/orders";

const PRIMARY = "#5E81F4";
const PRIMARY_DARK = "#1B51E5";
const SUCCESS = "#7CE7AC";
const WARNING = "#F4BE5E";
const ERROR = "#FF808B";

function MetricCard({ label, value, sub, color, icon }) {
    return (
        <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "18px 20px", border: "1px solid #F0F0F3", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ background: color + "15", borderRadius: 12, padding: 10, flexShrink: 0 }}>
                <span style={{ color, fontSize: 16 }}>{icon}</span>
            </div>
            <div>
                <div style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginTop: 4 }}>{label}</div>
                <div style={{ fontSize: 11, color: "#8181A5", marginTop: 2 }}>{sub}</div>
            </div>
        </div>
    );
}

function HorizontalBar({ data }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        
        const loadChart = () => {
            if (!window.Chart) return;
            
            if (chartRef.current) chartRef.current.destroy();
            
            const ctx = canvasRef.current.getContext("2d");
            chartRef.current = new window.Chart(ctx, {
                type: "bar",
                data: {
                    labels: data.map(d => d.label),
                    datasets: [{
                        data: data.map(d => d.value),
                        backgroundColor: data.map((_, i) => i === 0 ? PRIMARY : i === 1 ? "rgba(94, 129, 244, 0.6)" : "rgba(94, 129, 244, 0.3)"),
                        borderRadius: 8,
                        borderSkipped: false,
                        barPercentage: 0.7,
                        categoryPercentage: 0.8
                    }]
                },
                options: {
                    indexAxis: "y",
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: { 
                        legend: { display: false },
                        tooltip: { 
                            callbacks: { 
                                label: (ctx) => `${ctx.raw} pcs` 
                            } 
                        }
                    },
                    scales: {
                        x: { 
                            grid: { color: "#F0F0F3" }, 
                            ticks: { color: "#8181A5", font: { size: 11, family: "'Lato', sans-serif" } } 
                        },
                        y: { 
                            grid: { display: false }, 
                            ticks: { color: "#464A5F", font: { size: 12, family: "'Lato', sans-serif" } } 
                        }
                    }
                }
            });
        };
        
        if (window.Chart) {
            loadChart();
        } else {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
            script.onload = loadChart;
            document.head.appendChild(script);
        }
        
        return () => {
            if (chartRef.current) chartRef.current.destroy();
        };
    }, [data]);

    return (
        <div style={{ width: "100%", height: 220, position: "relative" }}>
            <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
        </div>
    );
}

function StackedBar({ labels, datasets }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        
        const loadChart = () => {
            if (!window.Chart) return;
            
            if (chartRef.current) chartRef.current.destroy();
            
            const ctx = canvasRef.current.getContext("2d");
            chartRef.current = new window.Chart(ctx, {
                type: "bar",
                data: { 
                    labels, 
                    datasets: datasets.map(ds => ({
                        ...ds,
                        borderRadius: 6,
                        barPercentage: 0.7,
                        categoryPercentage: 0.8
                    }))
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: { 
                        legend: { display: false },
                        tooltip: { 
                            callbacks: { 
                                label: (ctx) => `${ctx.dataset.label}: Rp ${ctx.raw.toLocaleString()}` 
                            } 
                        }
                    },
                    scales: {
                        x: { 
                            stacked: true, 
                            grid: { display: false }, 
                            ticks: { color: "#8181A5", font: { size: 11, family: "'Lato', sans-serif" } } 
                        },
                        y: { 
                            stacked: true, 
                            grid: { color: "#F0F0F3" }, 
                            ticks: { 
                                color: "#8181A5", 
                                font: { size: 11, family: "'Lato', sans-serif" }, 
                                callback: (v) => "Rp " + (v / 1000000).toFixed(0) + "jt" 
                            } 
                        }
                    }
                }
            });
        };
        
        if (window.Chart) {
            loadChart();
        } else {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
            script.onload = loadChart;
            document.head.appendChild(script);
        }
        
        return () => {
            if (chartRef.current) chartRef.current.destroy();
        };
    }, [labels, datasets]);

    return (
        <div style={{ width: "100%", height: 200, position: "relative" }}>
            <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
        </div>
    );
}

const getTopSellingItems = () => {
    const itemCount = {};
    orders.forEach(order => {
        order.items?.forEach(item => {
            itemCount[item] = (itemCount[item] || 0) + 1;
        });
    });
    return Object.entries(itemCount)
        .map(([name, count]) => ({ label: name, value: count }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
};

export default function Reports() {
    const totalTransaction = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const avgOrderValue = totalTransaction ? Math.round(totalRevenue / totalTransaction) : 0;
    const completedOrders = orders.filter(o => o.status === "Completed");
    const completedRevenue = completedOrders.reduce((s, o) => s + o.totalPrice, 0);
    const conversionRate = totalTransaction ? Math.round((completedOrders.length / totalTransaction) * 100) : 0;

    const memberRevenue = orders.filter(o => {
        const cust = customers.find(c => c.id === o.customerId);
        return cust && (cust.loyalty === "Gold" || cust.loyalty === "Silver");
    }).reduce((sum, o) => sum + o.totalPrice, 0);

    const totalCustomers = customers.length;
    const goldMembers = customers.filter(c => c.loyalty === "Gold").length;
    const topProducts = getTopSellingItems();

    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];
    const stackedDatasets = [
        { label: "Cash", data: [4000000, 5000000, 3500000, 6000000, 5500000, 4800000], backgroundColor: PRIMARY, borderRadius: 4 },
        { label: "Transfer", data: [3000000, 4000000, 5000000, 4500000, 5000000, 6000000], backgroundColor: "rgba(94, 129, 244, 0.6)", borderRadius: 4 },
        { label: "QRIS", data: [2000000, 2500000, 3000000, 3500000, 4000000, 4500000], backgroundColor: "rgba(94, 129, 244, 0.3)", borderRadius: 4 },
    ];

    const inactiveCustomers = [
        { name: "Hilman Fauzi", lastOrder: "31 Maret 2025", spent: 850000, favorite: "Roti Pisang" },
        { name: "Irfan Hakim", lastOrder: "8 April 2025", spent: 620000, favorite: "Roti Tawar" },
        { name: "Dewi Susanti", lastOrder: "2 April 2025", spent: 430000, favorite: "Croissant" },
        { name: "Budi Santoso", lastOrder: "25 Maret 2025", spent: 1200000, favorite: "Roti Coklat" },
    ];

    return (
        <div style={{ background: "#F6F6F6", minHeight: "100vh", paddingBottom: 32 }}>
            <PageHeader title="Laporan CRM" breadcrumb={["Dashboard", "Reports"]}>
                <button style={{ display: "flex", alignItems: "center", gap: 7, background: "#FFFFFF", color: PRIMARY, border: `1px solid ${PRIMARY}`, borderRadius: 12, padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(94, 129, 244, 0.05)"}
                    onMouseLeave={e => e.currentTarget.style.background = "#FFFFFF"}>
                    <FaDownload size={11} /> Export PDF
                </button>
            </PageHeader>

            {/* Metric Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12, marginBottom: 20 }}>
                <MetricCard label="Total Transaksi" value={totalTransaction} sub="Semua status" color={PRIMARY} icon={<FaChartBar />} />
                <MetricCard label="Total Pendapatan" value={`Rp ${(totalRevenue / 1000000).toFixed(1)}jt`} sub="Gross revenue" color={SUCCESS} icon={<FaArrowUp />} />
                <MetricCard label="Nilai Order Rata-rata" value={`Rp ${avgOrderValue.toLocaleString()}`} sub="Per transaksi" color="#A78BFA" icon={<FaChartBar />} />
                <MetricCard label="Konversi Selesai" value={`${conversionRate}%`} sub="Completed / total" color={WARNING} icon={<FaArrowUp />} />
                <MetricCard label="Total Pelanggan" value={totalCustomers} sub="Terdaftar" color="#60A5FA" icon={<FaUsers />} />
                <MetricCard label="Kontribusi Gold/Silver" value={`Rp ${(memberRevenue / 1000000).toFixed(1)}jt`} sub="Member premium" color={PRIMARY} icon={<FaChartBar />} />
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                {/* Top Products Chart */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "22px 24px", border: "1px solid #F0F0F3" }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>🍞 Produk Terlaris</div>
                    <div style={{ fontSize: 12, color: PRIMARY, marginBottom: 20 }}>Berdasarkan jumlah terjual</div>
                    <HorizontalBar data={topProducts} />
                </div>

                {/* Revenue by Payment Method Chart */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "22px 24px", border: "1px solid #F0F0F3" }}>
                    <div style={{ marginBottom: 4 }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>Revenue per Metode Bayar</div>
                        <div style={{ fontSize: 12, color: PRIMARY, marginTop: 2 }}>6 bulan terakhir</div>
                    </div>
                    <div style={{ display: "flex", gap: 14, marginBottom: 14, marginTop: 6 }}>
                        {stackedDatasets.map(d => (
                            <span key={d.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#8181A5" }}>
                                <span style={{ width: 10, height: 10, borderRadius: 2, background: d.backgroundColor, display: "inline-block" }} />
                                {d.label}
                            </span>
                        ))}
                    </div>
                    <StackedBar labels={monthLabels} datasets={stackedDatasets} />
                </div>
            </div>

            {/* Inactive Customers Table */}
            <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "22px 24px", border: "1px solid #F0F0F3", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <div style={{ background: "rgba(244, 190, 94, 0.1)", borderRadius: 10, padding: "6px 8px" }}>
                        <FaExclamationTriangle style={{ color: WARNING, fontSize: 14 }} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>Pelanggan Tidak Aktif (30+ Hari)</div>
                        <div style={{ fontSize: 12, color: PRIMARY }}>Perlu follow-up / promo retensi</div>
                    </div>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table className="figma-table">
                        <thead>
                            <tr>
                                <th>Pelanggan</th>
                                <th>Menu Favorit</th>
                                <th>Order Terakhir</th>
                                <th>Total Belanja</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inactiveCustomers.map(c => (
                                <tr key={c.name}>
                                    <td><div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(94, 129, 244, 0.1)", color: PRIMARY, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                                            {c.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                                        </div>
                                        <span style={{ fontWeight: 600, color: "#1A1A1A" }}>{c.name}</span>
                                    </div></td>
                                    <td><span style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(94, 129, 244, 0.1)", padding: "3px 10px", borderRadius: 20, width: "fit-content" }}>
                                        <FaCookie size={10} style={{ color: PRIMARY }} />
                                        <span style={{ fontSize: 12, color: PRIMARY }}>{c.favorite}</span>
                                    </span></td>
                                    <td><span style={{ background: "rgba(244, 190, 94, 0.1)", color: WARNING, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{c.lastOrder}</span></td>
                                    <td style={{ fontWeight: 700, color: PRIMARY }}>Rp {c.spent.toLocaleString()}</td>
                                    <td><button style={{ background: "rgba(94, 129, 244, 0.1)", color: PRIMARY, border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }} 
                                        onMouseEnter={e => { e.currentTarget.style.background = PRIMARY; e.currentTarget.style.color = "#FFF"; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(94, 129, 244, 0.1)"; e.currentTarget.style.color = PRIMARY; }}>
                                        Kirim Promo
                                    </button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary Footer */}
            <div style={{ background: PRIMARY, borderRadius: 16, padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                <div>
                    <div style={{ color: "#FFF", fontWeight: 700, fontSize: 16 }}>🍞 Rotte Bakery CRM</div>
                    <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 3 }}>Laporan diperbarui otomatis dari data transaksi</div>
                </div>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                    {[
                        { label: "Revenue Bersih", value: `Rp ${(completedRevenue / 1000000).toFixed(1)}jt` },
                        { label: "Gold Members", value: goldMembers },
                        { label: "Avg Order", value: `Rp ${(avgOrderValue / 1000).toFixed(0)}rb` },
                    ].map(s => (
                        <div key={s.label} style={{ textAlign: "center" }}>
                            <div style={{ color: "#FFF", fontWeight: 800, fontSize: 20 }}>{s.value}</div>
                            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 2 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}