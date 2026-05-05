import { useEffect, useRef } from "react";
import { FaChartBar, FaUsers, FaExclamationTriangle, FaArrowUp, FaDownload } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import customers from "../data/customers";
import orders from "../data/orders";


const MAROON = "#7B1C1C";
const MAROON_DARK = "#5A1313";
const MAROON_MUTED = "#F9EFEF";


function MetricCard({ label, value, sub, color, icon }) {
    return (
        <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", border: "1px solid #EEE", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ background: color + "1A", borderRadius: 10, padding: 10, flexShrink: 0 }}>
                <span style={{ color, fontSize: 16 }}>{icon}</span>
            </div>
            <div>
                <div style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#333", marginTop: 4 }}>{label}</div>
                <div style={{ fontSize: 11, color: "#AAA", marginTop: 2 }}>{sub}</div>
            </div>
        </div>
    );
}


// Horizontal bar chart untuk produk terlaris (simulasi)
function HorizontalBar({ data }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);
    useEffect(() => {
        if (!canvasRef.current) return;
        const load = () => {
            if (!window.Chart) return;
            if (chartRef.current) chartRef.current.destroy();
            chartRef.current = new window.Chart(canvasRef.current, {
                type: "bar",
                data: {
                    labels: data.map(d => d.label),
                    datasets: [{
                        data: data.map(d => d.value),
                        backgroundColor: data.map((_, i) => i === 0 ? MAROON : i === 1 ? "#A52A2A" : "#D4A0A0"),
                        borderRadius: 6,
                        borderSkipped: false,
                    }]
                },
                options: {
                    indexAxis: "y",
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { color: "#F5F5F5" }, ticks: { color: "#999", font: { size: 11 }, callback: v => v + " pcs" } },
                        y: { grid: { display: false }, ticks: { color: "#555", font: { size: 12 } } }
                    }
                }
            });
        };
        if (window.Chart) load();
        else {
            const s = document.createElement("script");
            s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
            s.onload = load;
            document.head.appendChild(s);
        }
        return () => { if (chartRef.current) chartRef.current.destroy(); };
    }, []);
    return <canvas ref={canvasRef} role="img" aria-label="Horizontal bar chart produk terlaris" />;
}


// Stacked bar: revenue per payment method
function StackedBar({ labels, datasets }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);
    useEffect(() => {
        if (!canvasRef.current) return;
        const load = () => {
            if (!window.Chart) return;
            if (chartRef.current) chartRef.current.destroy();
            chartRef.current = new window.Chart(canvasRef.current, {
                type: "bar",
                data: { labels, datasets },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { stacked: true, grid: { display: false }, ticks: { color: "#999", font: { size: 11 } } },
                        y: { stacked: true, grid: { color: "#F5F5F5" }, ticks: { color: "#999", font: { size: 11 }, callback: v => "Rp " + (v / 1000000).toFixed(0) + "jt" } }
                    }
                }
            });
        };
        if (window.Chart) load();
        else {
            const s = document.createElement("script");
            s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
            s.onload = load;
            document.head.appendChild(s);
        }
        return () => { if (chartRef.current) chartRef.current.destroy(); };
    }, []);
    return <canvas ref={canvasRef} role="img" aria-label="Stacked bar chart revenue per metode pembayaran" />;
}


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


    // Simulasi produk terlaris
    const topProducts = [
        { label: "Roti Coklat", value: 142 },
        { label: "Croissant", value: 118 },
        { label: "Sourdough", value: 97 },
        { label: "Roti Tawar", value: 85 },
        { label: "Cinnamon Roll", value: 71 },
    ];


    // Simulasi revenue per payment method per bulan
    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];
    const stackedDatasets = [
        { label: "Cash",     data: [4000000, 5000000, 3500000, 6000000, 5500000, 4800000], backgroundColor: MAROON,   borderRadius: 4 },
        { label: "Transfer", data: [3000000, 4000000, 5000000, 4500000, 5000000, 6000000], backgroundColor: "#C45A5A", borderRadius: 4 },
        { label: "QRIS",     data: [2000000, 2500000, 3000000, 3500000, 4000000, 4500000], backgroundColor: "#F0C0C0", borderRadius: 4 },
    ];


    // Pelanggan tidak aktif (simulasi: tanggal terakhir order > 30 hari)
    const inactiveCustomers = [
        { name: "Hilman Fauzi",  lastOrder: "31 Maret 2025",  spent: 850000 },
        { name: "Irfan Hakim",   lastOrder: "8 April 2025",   spent: 620000 },
        { name: "Dewi Susanti",  lastOrder: "2 April 2025",   spent: 430000 },
        { name: "Budi Santoso",  lastOrder: "25 Maret 2025",  spent: 1200000 },
    ];


    return (
        <div style={{ background: "#F7F7F7", minHeight: "100vh", paddingBottom: 32 }}>
            <PageHeader title="Laporan CRM" breadcrumb={["Dashboard", "Reports"]}>
                <button style={{ display: "flex", alignItems: "center", gap: 7, background: "#fff", color: MAROON, border: `1px solid ${MAROON}`, borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    <FaDownload size={11} /> Export PDF
                </button>
            </PageHeader>


            {/* Metric Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
                <MetricCard label="Total Transaksi" value={totalTransaction} sub="Semua status" color={MAROON} icon={<FaChartBar />} />
                <MetricCard label="Total Pendapatan" value={`Rp ${(totalRevenue / 1000000).toFixed(1)}jt`} sub="Gross revenue" color="#16A34A" icon={<FaArrowUp />} />
                <MetricCard label="Nilai Order Rata-rata" value={`Rp ${avgOrderValue.toLocaleString()}`} sub="Per transaksi" color="#7C3AED" icon={<FaChartBar />} />
                <MetricCard label="Konversi Selesai" value={`${conversionRate}%`} sub="Completed / total" color="#CA8A04" icon={<FaArrowUp />} />
                <MetricCard label="Total Pelanggan" value={totalCustomers} sub="Terdaftar" color="#0369A1" icon={<FaUsers />} />
                <MetricCard label="Kontribusi Gold/Silver" value={`Rp ${(memberRevenue / 1000000).toFixed(1)}jt`} sub="Member premium" color={MAROON} icon={<FaChartBar />} />
            </div>


            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                {/* Top Products */}
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", border: "1px solid #EEE" }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>Produk Terlaris</div>
                    <div style={{ fontSize: 12, color: "#AAA", marginBottom: 20 }}>Berdasarkan jumlah terjual</div>
                    <div style={{ position: "relative", height: 200 }}>
                        <HorizontalBar data={topProducts} />
                    </div>
                </div>


                {/* Stacked Revenue */}
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", border: "1px solid #EEE" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>Revenue per Metode Bayar</div>
                            <div style={{ fontSize: 12, color: "#AAA", marginTop: 2 }}>6 bulan terakhir</div>
                        </div>
                    </div>
                    {/* Custom legend */}
                    <div style={{ display: "flex", gap: 14, marginBottom: 14, marginTop: 6 }}>
                        {stackedDatasets.map(d => (
                            <span key={d.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#888" }}>
                                <span style={{ width: 10, height: 10, borderRadius: 2, background: d.backgroundColor, display: "inline-block" }} />
                                {d.label}
                            </span>
                        ))}
                    </div>
                    <div style={{ position: "relative", height: 180 }}>
                        <StackedBar labels={monthLabels} datasets={stackedDatasets} />
                    </div>
                </div>
            </div>


            {/* Inactive Customers */}
            <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", border: "1px solid #EEE", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <div style={{ background: "#FEF9C3", borderRadius: 8, padding: "6px 8px" }}>
                        <FaExclamationTriangle style={{ color: "#CA8A04", fontSize: 14 }} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>Pelanggan Tidak Aktif (30+ Hari)</div>
                        <div style={{ fontSize: 12, color: "#AAA" }}>Perlu follow-up / promo retensi</div>
                    </div>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: "#FAFAFA" }}>
                                {["Pelanggan", "Order Terakhir", "Total Belanja Historis", "Aksi"].map(h => (
                                    <th key={h} style={{ textAlign: "left", padding: "10px 14px", color: "#999", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4, borderBottom: "1px solid #F0F0F0" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {inactiveCustomers.map(c => (
                                <tr key={c.name}
                                    style={{ borderBottom: "1px solid #F9F9F9" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    <td style={{ padding: "12px 14px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: MAROON_MUTED, color: MAROON, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                                                {c.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                                            </div>
                                            <span style={{ fontWeight: 600, color: "#222" }}>{c.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: "12px 14px" }}>
                                        <span style={{ background: "#FEF9C3", color: "#A16207", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{c.lastOrder}</span>
                                    </td>
                                    <td style={{ padding: "12px 14px", fontWeight: 700, color: MAROON }}>Rp {c.spent.toLocaleString()}</td>
                                    <td style={{ padding: "12px 14px" }}>
                                        <button style={{ background: MAROON_MUTED, color: MAROON, border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                                            Kirim Promo
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* Summary Footer */}
            <div style={{ background: `linear-gradient(135deg, ${MAROON} 0%, ${MAROON_DARK} 100%)`, borderRadius: 14, padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Rotte Bakery CRM</div>
                    <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 3 }}>Laporan diperbarui otomatis dari data transaksi</div>
                </div>
                <div style={{ display: "flex", gap: 24 }}>
                    {[
                        { label: "Revenue Bersih", value: `Rp ${(completedRevenue / 1000000).toFixed(1)}jt` },
                        { label: "Gold Members", value: goldMembers },
                        { label: "Avg Order", value: `Rp ${(avgOrderValue / 1000).toFixed(0)}rb` },
                    ].map(s => (
                        <div key={s.label} style={{ textAlign: "center" }}>
                            <div style={{ color: "#fff", fontWeight: 800, fontSize: 20 }}>{s.value}</div>
                            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

