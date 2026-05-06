import { useEffect, useRef } from "react";
import { FaChartBar, FaUsers, FaExclamationTriangle, FaArrowUp, FaDownload, FaCookie } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import customers from "../data/customers";
import orders from "../data/orders";

const GOLD = "#D4AF37";

function MetricCard({ label, value, sub, color, icon }) {
    return (
        <div style={{ background: "rgba(21, 23, 29, 0.8)", backdropFilter: "blur(12px)", borderRadius: 14, padding: "18px 20px", border: "1px solid rgba(212, 175, 55, 0.2)", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ background: color + "20", borderRadius: 12, padding: 10, flexShrink: 0 }}>
                <span style={{ color, fontSize: 16 }}>{icon}</span>
            </div>
            <div>
                <div style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#F3F4F6", marginTop: 4 }}>{label}</div>
                <div style={{ fontSize: 11, color: "#D4AF37", marginTop: 2 }}>{sub}</div>
            </div>
        </div>
    );
}

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
                        backgroundColor: data.map((_, i) => i === 0 ? GOLD : i === 1 ? "#F5D76E" : "rgba(212, 175, 55, 0.4)"),
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
                        x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#9CA3AF", font: { size: 11 }, callback: v => v + " pcs" } },
                        y: { grid: { display: false }, ticks: { color: "#F3F4F6", font: { size: 12 } } }
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
                        x: { stacked: true, grid: { display: false }, ticks: { color: "#9CA3AF", font: { size: 11 } } },
                        y: { stacked: true, grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#9CA3AF", font: { size: 11 }, callback: v => "Rp " + (v / 1000000).toFixed(0) + "jt" } }
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

// Get top selling items
const getTopSellingItems = () => {
    const itemCount = {};
    orders.forEach(order => {
        order.items.forEach(item => {
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
        { label: "Cash",     data: [4000000, 5000000, 3500000, 6000000, 5500000, 4800000], backgroundColor: GOLD,   borderRadius: 4 },
        { label: "Transfer", data: [3000000, 4000000, 5000000, 4500000, 5000000, 6000000], backgroundColor: "#F5D76E", borderRadius: 4 },
        { label: "QRIS",     data: [2000000, 2500000, 3000000, 3500000, 4000000, 4500000], backgroundColor: "rgba(212, 175, 55, 0.4)", borderRadius: 4 },
    ];

    const inactiveCustomers = [
        { name: "Hilman Fauzi",  lastOrder: "31 Maret 2025",  spent: 850000, favorite: "Roti Pisang" },
        { name: "Irfan Hakim",   lastOrder: "8 April 2025",   spent: 620000, favorite: "Roti Tawar" },
        { name: "Dewi Susanti",  lastOrder: "2 April 2025",   spent: 430000, favorite: "Croissant" },
        { name: "Budi Santoso",  lastOrder: "25 Maret 2025",  spent: 1200000, favorite: "Roti Coklat" },
    ];

    return (
        <div style={{ background: "#0A0C10", minHeight: "100vh", paddingBottom: 32 }}>
            <PageHeader title="Laporan CRM" breadcrumb={["Dashboard", "Reports"]}>
                <button style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(21, 23, 29, 0.8)", color: "#D4AF37", border: `1px solid ${GOLD}`, borderRadius: 12, padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    <FaDownload size={11} /> Export PDF
                </button>
            </PageHeader>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12, marginBottom: 20 }}>
                <MetricCard label="Total Transaksi" value={totalTransaction} sub="Semua status" color={GOLD} icon={<FaChartBar />} />
                <MetricCard label="Total Pendapatan" value={`Rp ${(totalRevenue / 1000000).toFixed(1)}jt`} sub="Gross revenue" color="#4ADE80" icon={<FaArrowUp />} />
                <MetricCard label="Nilai Order Rata-rata" value={`Rp ${avgOrderValue.toLocaleString()}`} sub="Per transaksi" color="#A78BFA" icon={<FaChartBar />} />
                <MetricCard label="Konversi Selesai" value={`${conversionRate}%`} sub="Completed / total" color="#FBBF24" icon={<FaArrowUp />} />
                <MetricCard label="Total Pelanggan" value={totalCustomers} sub="Terdaftar" color="#60A5FA" icon={<FaUsers />} />
                <MetricCard label="Kontribusi Gold/Silver" value={`Rp ${(memberRevenue / 1000000).toFixed(1)}jt`} sub="Member premium" color={GOLD} icon={<FaChartBar />} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div style={{ background: "rgba(21, 23, 29, 0.8)", backdropFilter: "blur(12px)", borderRadius: 16, padding: "22px 24px", border: "1px solid rgba(212, 175, 55, 0.2)" }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#F3F4F6", marginBottom: 4 }}>🍞 Produk Terlaris</div>
                    <div style={{ fontSize: 12, color: "#D4AF37", marginBottom: 20 }}>Berdasarkan jumlah terjual</div>
                    <div style={{ position: "relative", height: 200 }}>
                        <HorizontalBar data={topProducts} />
                    </div>
                </div>

                <div style={{ background: "rgba(21, 23, 29, 0.8)", backdropFilter: "blur(12px)", borderRadius: 16, padding: "22px 24px", border: "1px solid rgba(212, 175, 55, 0.2)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 15, color: "#F3F4F6" }}>Revenue per Metode Bayar</div>
                            <div style={{ fontSize: 12, color: "#D4AF37", marginTop: 2 }}>6 bulan terakhir</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 14, marginBottom: 14, marginTop: 6 }}>
                        {stackedDatasets.map(d => (
                            <span key={d.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#9CA3AF" }}>
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

            <div style={{ background: "rgba(21, 23, 29, 0.8)", backdropFilter: "blur(12px)", borderRadius: 16, padding: "22px 24px", border: "1px solid rgba(212, 175, 55, 0.2)", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <div style={{ background: "rgba(251, 191, 36, 0.15)", borderRadius: 10, padding: "6px 8px" }}>
                        <FaExclamationTriangle style={{ color: "#FBBF24", fontSize: 14 }} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#F3F4F6" }}>Pelanggan Tidak Aktif (30+ Hari)</div>
                        <div style={{ fontSize: 12, color: "#D4AF37" }}>Perlu follow-up / promo retensi</div>
                    </div>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: "rgba(0,0,0,0.2)" }}>
                                {["Pelanggan", "Menu Favorit", "Order Terakhir", "Total Belanja", "Aksi"].map(h => (
                                    <th key={h} style={{ textAlign: "left", padding: "10px 14px", color: "#D4AF37", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4, borderBottom: "1px solid rgba(212, 175, 55, 0.15)" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {inactiveCustomers.map(c => (
                                <tr key={c.name}
                                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(212, 175, 55, 0.05)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    <td style={{ padding: "12px 14px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(212, 175, 55, 0.15)", color: "#D4AF37", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                                                {c.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                                            </div>
                                            <span style={{ fontWeight: 600, color: "#F3F4F6" }}>{c.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: "12px 14px" }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(212, 175, 55, 0.1)", padding: "3px 10px", borderRadius: 20, width: "fit-content" }}>
                                            <FaCookie size={10} style={{ color: "#D4AF37" }} />
                                            <span style={{ fontSize: 12, color: "#D4AF37" }}>{c.favorite}</span>
                                        </span>
                                    </td>
                                    <td style={{ padding: "12px 14px" }}>
                                        <span style={{ background: "rgba(251, 191, 36, 0.15)", color: "#FBBF24", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{c.lastOrder}</span>
                                    </td>
                                    <td style={{ padding: "12px 14px", fontWeight: 700, color: "#D4AF37" }}>Rp {c.spent.toLocaleString()}</td>
                                    <td style={{ padding: "12px 14px" }}>
                                        <button style={{ background: "rgba(212, 175, 55, 0.15)", color: "#D4AF37", border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                                            Kirim Promo
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ background: "linear-gradient(135deg, #D4AF37, #B8942E)", borderRadius: 16, padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <div style={{ color: "#000", fontWeight: 700, fontSize: 16 }}>🍞 Rotte Bakery CRM</div>
                    <div style={{ color: "rgba(0,0,0,0.6)", fontSize: 12, marginTop: 3 }}>Laporan diperbarui otomatis dari data transaksi</div>
                </div>
                <div style={{ display: "flex", gap: 24 }}>
                    {[
                        { label: "Revenue Bersih", value: `Rp ${(completedRevenue / 1000000).toFixed(1)}jt` },
                        { label: "Gold Members", value: goldMembers },
                        { label: "Avg Order", value: `Rp ${(avgOrderValue / 1000).toFixed(0)}rb` },
                    ].map(s => (
                        <div key={s.label} style={{ textAlign: "center" }}>
                            <div style={{ color: "#000", fontWeight: 800, fontSize: 20 }}>{s.value}</div>
                            <div style={{ color: "rgba(0,0,0,0.5)", fontSize: 11, marginTop: 2 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}