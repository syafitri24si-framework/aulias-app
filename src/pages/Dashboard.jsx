import { FaShoppingCart, FaTruck, FaBan, FaDollarSign, FaUsers, FaStar, FaArrowUp, FaArrowDown, FaCookie } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import PageHeader from "../components/PageHeader";
import customers from "../data/customers";
import orders from "../data/orders";

const PRIMARY = "#5E81F4";
const PRIMARY_DARK = "#1B51E5";
const SUCCESS = "#7CE7AC";
const WARNING = "#F4BE5E";
const ERROR = "#FF808B";

const getTopSellingItems = () => {
    const itemCount = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            itemCount[item] = (itemCount[item] || 0) + 1;
        });
    });
    return Object.entries(itemCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
};

function Sparkline({ data, color }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const w = 80, h = 32;
    const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
    return (
        <svg width={w} height={h} style={{ display: "block" }}>
            <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        </svg>
    );
}

function StatCard({ icon, label, value, sub, trend, sparkData, accent, onClick }) {
    const isUp = trend >= 0;
    return (
        <div
            onClick={onClick}
            style={{
                background: "#FFFFFF",
                borderRadius: 16,
                padding: "18px 20px",
                border: "1px solid #F0F0F3",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = PRIMARY; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(94,129,244,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#F0F0F3"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)"; }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ background: "rgba(94, 129, 244, 0.1)", borderRadius: 12, width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: PRIMARY, fontSize: 18 }}>{icon}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: isUp ? SUCCESS : ERROR }}>
                    {isUp ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                    {Math.abs(trend)}%
                </div>
            </div>
            <div>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#1A1A1A", lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 13, color: "#8181A5", marginTop: 4 }}>{label}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <span style={{ fontSize: 11, color: "#AAABB0" }}>{sub}</span>
                {sparkData && <Sparkline data={sparkData} color={accent || PRIMARY} />}
            </div>
        </div>
    );
}

function BarChart({ data, labels }) {
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
                    labels,
                    datasets: [{
                        label: "Pendapatan (Rp)",
                        data,
                        backgroundColor: data.map((_, i) => i === data.length - 1 ? PRIMARY : "rgba(94, 129, 244, 0.3)"),
                        borderRadius: 6,
                        borderSkipped: false,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: "#8181A5", font: { size: 11, family: "'Lato', sans-serif" } } },
                        y: {
                            grid: { color: "#F0F0F3" },
                            ticks: {
                                color: "#8181A5", font: { size: 11, family: "'Lato', sans-serif" },
                                callback: v => "Rp " + (v / 1000000).toFixed(0) + "jt"
                            }
                        }
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
    }, [data, labels]);

    return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
}

function LineChart({ data, labels }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const load = () => {
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
                        x: { grid: { display: false }, ticks: { color: "#8181A5", font: { size: 11, family: "'Lato', sans-serif" } } },
                        y: { grid: { color: "#F0F0F3" }, ticks: { color: "#8181A5", font: { size: 11, family: "'Lato', sans-serif" } } }
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
    }, [data, labels]);

    return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
}

function PieChart({ segments }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const load = () => {
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
                        hoverOffset: 6,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "65%",
                    plugins: {
                        legend: { display: false },
                        tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed}` } }
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
    }, [segments]);

    return <canvas ref={canvasRef} style={{ width: "160px", height: "160px" }} />;
}

function RecentOrders({ orders }) {
    const statusStyle = {
        Completed: { background: "rgba(124, 231, 172, 0.15)", color: SUCCESS },
        Pending: { background: "rgba(244, 190, 94, 0.15)", color: WARNING },
        Cancelled: { background: "rgba(255, 128, 139, 0.15)", color: ERROR },
    };
    return (
        <div style={{ width: "100%", overflowX: "auto" }}>
            <table className="figma-table">
                <thead>
                    <tr>
                        <th>ID</th><th>Customer</th><th>Items</th><th>Status</th><th>Total</th><th>Tanggal</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.slice(0, 7).map(o => (
                        <tr key={o.id}>
                            <td style={{ color: "#8181A5", fontFamily: "monospace" }}>#{o.id}</td>
                            <td style={{ fontWeight: 500, color: "#464A5F" }}>{o.customerName}</td>
                            <td>
                                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                    {o.items?.map((item, idx) => (
                                        <span key={idx} style={{ background: "rgba(94, 129, 244, 0.1)", color: PRIMARY, padding: "2px 8px", borderRadius: 12, fontSize: 10 }}>{item}</span>
                                    ))}
                                </div>
                            </td>
                            <td><span style={{ ...statusStyle[o.status], padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{o.status}</span></td>
                            <td style={{ fontWeight: 600, color: PRIMARY }}>Rp {o.totalPrice.toLocaleString()}</td>
                            <td style={{ color: "#8181A5" }}>{o.orderDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function TopCustomerItem({ rank, name, spent, tier, favoriteItem }) {
    const tierColor = { Gold: PRIMARY, Silver: "#8181A5", Bronze: "#F4BE5E", None: "#AAABB0" };
    const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("");
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #F0F0F3" }}>
            <div style={{ fontSize: 13, color: PRIMARY, fontWeight: 700, width: 24 }}>{rank}</div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(94, 129, 244, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: PRIMARY, flexShrink: 0 }}>{initials}</div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#1A1A1A" }}>{name}</div>
                <div style={{ fontSize: 11, color: PRIMARY }}>Rp {spent.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: "#AAABB0", marginTop: 2 }}>🍞 Fav: {favoriteItem}</div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, background: tierColor[tier] + "20", color: tierColor[tier], padding: "4px 10px", borderRadius: 20 }}>{tier}</span>
        </div>
    );
}

const getCustomerFavoriteItem = (customerId) => {
    const customerOrders = orders.filter(o => o.customerId === customerId);
    const itemCount = {};
    customerOrders.forEach(order => {
        order.items?.forEach(item => {
            itemCount[item] = (itemCount[item] || 0) + 1;
        });
    });
    const favorite = Object.entries(itemCount).sort((a, b) => b[1] - a[1])[0];
    return favorite ? favorite[0] : "-";
};

export default function Dashboard() {
    const [modal, setModal] = useState(null);

    const totalOrders = orders.length;
    const totalCompleted = orders.filter(o => o.status === "Completed").length;
    const totalCancelled = orders.filter(o => o.status === "Cancelled").length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const totalCustomers = customers.length;
    const activeMembers = customers.filter(c => c.loyalty !== "None" && c.points > 0).length;
    const topSellingItems = getTopSellingItems();

    const monthLabels = ["Nov", "Des", "Jan", "Feb", "Mar", "Apr"];
    const revenueData = [18500000, 22000000, 19800000, 25000000, 23400000, totalRevenue];
    const orderTrendData = [22, 28, 24, 32, 29, totalOrders];
    const sparkOrders = [22, 28, 24, 32, 29, totalOrders];
    const sparkRevenue = [185, 220, 198, 250, 234, Math.round(totalRevenue / 100000)];

    const pieSegments = [
        { label: "Completed", value: totalCompleted, color: SUCCESS },
        { label: "Pending", value: orders.filter(o => o.status === "Pending").length, color: WARNING },
        { label: "Cancelled", value: totalCancelled, color: ERROR },
    ];

    const topCustomers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5).map(c => ({
        ...c,
        favoriteItem: getCustomerFavoriteItem(c.id)
    }));

    return (
        <div style={{ background: "#F6F6F6", minHeight: "100vh", paddingBottom: 32 }}>
            <PageHeader title="Dashboard" breadcrumb={["Home"]}>
                <div style={{ display: "none" }} />
            </PageHeader>

            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 16, marginBottom: 24 }}>
                <StatCard icon={<FaShoppingCart />} label="Total Orders" value={totalOrders} sub="Semua waktu" trend={12} sparkData={sparkOrders} onClick={() => setModal({ title: "Total Orders", value: totalOrders })} />
                <StatCard icon={<FaTruck />} label="Selesai" value={totalCompleted} sub="Completed orders" trend={8} sparkData={[18, 22, 20, 26, 23, totalCompleted]} onClick={() => setModal({ title: "Completed Orders", value: totalCompleted })} />
                <StatCard icon={<FaBan />} label="Dibatalkan" value={totalCancelled} sub="Cancelled orders" trend={-3} sparkData={[5, 3, 6, 4, 5, totalCancelled]} accent={ERROR} onClick={() => setModal({ title: "Cancelled", value: totalCancelled })} />
                <StatCard icon={<FaDollarSign />} label="Pendapatan" value={`Rp ${(totalRevenue / 1000000).toFixed(1)}jt`} sub="Total revenue" trend={15} sparkData={sparkRevenue} onClick={() => setModal({ title: "Total Revenue", value: `Rp ${totalRevenue.toLocaleString()}` })} />
                <StatCard icon={<FaUsers />} label="Pelanggan" value={totalCustomers} sub="Terdaftar" trend={5} sparkData={[80, 92, 95, 101, 105, totalCustomers]} onClick={() => setModal({ title: "Total Customers", value: totalCustomers })} />
                <StatCard icon={<FaStar />} label="Active Members" value={activeMembers} sub="Loyalty aktif" trend={9} sparkData={[30, 35, 32, 38, 36, activeMembers]} onClick={() => setModal({ title: "Active Members", value: activeMembers })} />
            </div>

            {/* Top 5 Menu Terlaris */}
            <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "20px 24px", border: "1px solid #F0F0F3", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <FaCookie style={{ color: PRIMARY, fontSize: 20 }} />
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>🍞 Top 5 Menu Terlaris</div>
                        <div style={{ fontSize: 12, color: PRIMARY }}>Berdasarkan jumlah pesanan</div>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {topSellingItems.map((item, idx) => (
                        <div key={item.name} style={{ flex: 1, minWidth: 100 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span style={{ fontSize: 12, color: "#464A5F" }}>{idx + 1}. {item.name}</span>
                                <span style={{ fontSize: 12, color: PRIMARY }}>{item.count}×</span>
                            </div>
                            <div style={{ height: 6, background: "#F0F0F3", borderRadius: 3 }}>
                                <div style={{ height: "100%", width: `${(item.count / topSellingItems[0].count) * 100}%`, background: PRIMARY, borderRadius: 3 }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pendapatan Bulanan & Status Order */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "20px 24px", border: "1px solid #F0F0F3" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>Pendapatan Bulanan</div>
                            <div style={{ fontSize: 12, color: PRIMARY, marginTop: 2 }}>6 bulan terakhir</div>
                        </div>
                        <span style={{ background: "rgba(94, 129, 244, 0.1)", color: PRIMARY, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>+15% vs bulan lalu</span>
                    </div>
                    <div style={{ position: "relative", height: 220 }}>
                        <BarChart data={revenueData} labels={monthLabels} />
                    </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "20px 24px", border: "1px solid #F0F0F3" }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>Status Order</div>
                    <div style={{ fontSize: 12, color: PRIMARY, marginBottom: 20 }}>Distribusi semua order</div>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                        <PieChart segments={pieSegments} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {pieSegments.map(seg => (
                            <div key={seg.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12 }}>
                                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ width: 10, height: 10, borderRadius: 2, background: seg.color, display: "inline-block" }} />
                                    <span style={{ color: "#8181A5" }}>{seg.label}</span>
                                </span>
                                <span style={{ fontWeight: 600, color: "#1A1A1A" }}>{seg.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tren Order & Top Pelanggan */}
            <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16, marginBottom: 16 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "20px 24px", border: "1px solid #F0F0F3" }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>Tren Order</div>
                    <div style={{ fontSize: 12, color: PRIMARY, marginBottom: 20 }}>Jumlah order per bulan</div>
                    <div style={{ position: "relative", height: 180 }}>
                        <LineChart data={orderTrendData} labels={monthLabels} />
                    </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "20px 24px", border: "1px solid #F0F0F3" }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>⭐ Top Pelanggan</div>
                    <div style={{ fontSize: 12, color: PRIMARY, marginBottom: 16 }}>Berdasarkan total belanja + menu favorit</div>
                    {topCustomers.map((c, i) => (
                        <TopCustomerItem key={c.id} rank={i + 1} name={c.name} spent={c.totalSpent} tier={c.loyalty} favoriteItem={c.favoriteItem} />
                    ))}
                </div>
            </div>

            {/* Order Terbaru */}
            <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "20px 24px", border: "1px solid #F0F0F3" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>📦 Order Terbaru</div>
                        <div style={{ fontSize: 12, color: PRIMARY, marginTop: 2 }}>7 order terkini dengan detail item</div>
                    </div>
                    <a href="/orders" style={{ fontSize: 12, color: PRIMARY, fontWeight: 600, textDecoration: "none" }}>Lihat semua →</a>
                </div>
                <RecentOrders orders={orders} />
            </div>

            {/* Modal */}
            {modal && (
                <div
                    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}
                    onClick={() => setModal(null)}
                >
                    <div
                        style={{ background: "#FFFFFF", borderRadius: 20, padding: "32px 28px", width: 320, border: "1px solid #F0F0F3", boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(94, 129, 244, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                            <FaShoppingCart style={{ color: PRIMARY, fontSize: 20 }} />
                        </div>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", margin: "0 0 4px" }}>{modal.title}</h2>
                        <p style={{ fontSize: 13, color: "#8181A5", margin: "0 0 20px" }}>Ringkasan data</p>
                        <div style={{ fontSize: 36, fontWeight: 800, color: PRIMARY, marginBottom: 24 }}>{modal.value}</div>
                        <button
                            onClick={() => setModal(null)}
                            style={{ width: "100%", background: PRIMARY, color: "#FFF", border: "none", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                            onMouseEnter={e => e.currentTarget.style.background = PRIMARY_DARK}
                            onMouseLeave={e => e.currentTarget.style.background = PRIMARY}
                        >Tutup</button>
                    </div>
                </div>
            )}
        </div>
    );
}