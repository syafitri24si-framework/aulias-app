import { FaShoppingCart, FaTruck, FaBan, FaDollarSign, FaUsers, FaStar, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import PageHeader from "../components/PageHeader";
import customers from "../data/customers";
import orders from "../data/orders";


// ─── Warna tema maroon ───────────────────────────────────────────────────────
const MAROON = "#7B1C1C";
const MAROON_DARK = "#5A1313";
const MAROON_LIGHT = "#A52A2A";
const MAROON_MUTED = "#F9EFEF";


// ─── Mini sparkline SVG ──────────────────────────────────────────────────────
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


// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, trend, sparkData, accent, onClick }) {
    const isUp = trend >= 0;
    return (
        <div
            onClick={onClick}
            style={{
                background: "#fff",
                borderRadius: 14,
                padding: "18px 20px",
                border: "1px solid #EEE",
                cursor: "pointer",
                transition: "box-shadow 0.2s, transform 0.2s",
                display: "flex",
                flexDirection: "column",
                gap: 10,
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(123,28,28,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ background: MAROON_MUTED, borderRadius: 10, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: MAROON, fontSize: 16 }}>{icon}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: isUp ? "#16A34A" : "#DC2626" }}>
                    {isUp ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                    {Math.abs(trend)}%
                </div>
            </div>
            <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#1A1A1A", lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{label}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <span style={{ fontSize: 11, color: "#AAA" }}>{sub}</span>
                {sparkData && <Sparkline data={sparkData} color={accent || MAROON} />}
            </div>
        </div>
    );
}


// ─── Donut Chart (pure SVG) ──────────────────────────────────────────────────
function DonutChart({ segments, size = 120, thickness = 22 }) {
    const r = (size - thickness) / 2;
    const circ = 2 * Math.PI * r;
    const cx = size / 2, cy = size / 2;
    let offset = 0;
    const total = segments.reduce((s, seg) => s + seg.value, 0);
    return (
        <svg width={size} height={size}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F3F3" strokeWidth={thickness} />
            {segments.map((seg, i) => {
                const dash = (seg.value / total) * circ;
                const gap = circ - dash;
                const el = (
                    <circle
                        key={i}
                        cx={cx} cy={cy} r={r}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth={thickness}
                        strokeDasharray={`${dash} ${gap}`}
                        strokeDashoffset={-offset}
                        style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                    />
                );
                offset += dash;
                return el;
            })}
            <text x={cx} y={cy - 6} textAnchor="middle" fontSize="20" fontWeight="700" fill="#1A1A1A">{total}</text>
            <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="#999">total</text>
        </svg>
    );
}


// ─── Bar Chart (Canvas via Chart.js) ─────────────────────────────────────────
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
                        backgroundColor: data.map((_, i) => i === data.length - 1 ? MAROON : "#F0C0C0"),
                        borderRadius: 6,
                        borderSkipped: false,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: "#999", font: { size: 11 } } },
                        y: {
                            grid: { color: "#F5F5F5" },
                            ticks: {
                                color: "#999", font: { size: 11 },
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
    }, []);


    return <canvas ref={canvasRef} role="img" aria-label="Bar chart pendapatan per bulan" />;
}


// ─── Line Chart ──────────────────────────────────────────────────────────────
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
                        borderColor: MAROON,
                        backgroundColor: "rgba(123,28,28,0.08)",
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: MAROON,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: "#999", font: { size: 11 } } },
                        y: { grid: { color: "#F5F5F5" }, ticks: { color: "#999", font: { size: 11 } } }
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


    return <canvas ref={canvasRef} role="img" aria-label="Line chart trend order per bulan" />;
}


// ─── Order Status Pie Chart ───────────────────────────────────────────────────
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
    }, []);


    return <canvas ref={canvasRef} role="img" aria-label="Pie chart status order" />;
}


// ─── Tabel Recent Orders ──────────────────────────────────────────────────────
function RecentOrders({ orders }) {
    const statusStyle = {
        Completed: { background: "#DCFCE7", color: "#15803D" },
        Pending: { background: "#FEF9C3", color: "#A16207" },
        Cancelled: { background: "#FEE2E2", color: "#B91C1C" },
    };
    return (
        <div style={{ width: "100%", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                    <tr style={{ borderBottom: "2px solid #F0F0F0" }}>
                        {["ID", "Customer", "Status", "Total", "Tanggal"].map(h => (
                            <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#888", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {orders.slice(0, 7).map(o => (
                        <tr key={o.id} style={{ borderBottom: "1px solid #F9F9F9" }}
                            onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            <td style={{ padding: "10px 12px", color: "#999", fontFamily: "monospace" }}>#{o.id}</td>
                            <td style={{ padding: "10px 12px", fontWeight: 500, color: "#333" }}>{o.customerName}</td>
                            <td style={{ padding: "10px 12px" }}>
                                <span style={{ ...statusStyle[o.status], padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{o.status}</span>
                            </td>
                            <td style={{ padding: "10px 12px", fontWeight: 600, color: MAROON }}>Rp {o.totalPrice.toLocaleString()}</td>
                            <td style={{ padding: "10px 12px", color: "#999" }}>{o.orderDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


// ─── Top Customer Item ────────────────────────────────────────────────────────
function TopCustomerItem({ rank, name, spent, tier }) {
    const tierColor = { Gold: "#F59E0B", Silver: "#94A3B8", Bronze: "#B45309", None: "#CBD5E1" };
    const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("");
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #F5F5F5" }}>
            <div style={{ fontSize: 13, color: "#CCC", fontWeight: 700, width: 16 }}>{rank}</div>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: MAROON_MUTED, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: MAROON, flexShrink: 0 }}>{initials}</div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#222" }}>{name}</div>
                <div style={{ fontSize: 11, color: "#AAA" }}>Rp {spent.toLocaleString()}</div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, background: tier === "Gold" ? "#FEF3C7" : tier === "Silver" ? "#F1F5F9" : tier === "Bronze" ? "#FEF0E0" : "#F5F5F5", color: tierColor[tier], padding: "2px 8px", borderRadius: 10 }}>{tier}</span>
        </div>
    );
}


// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function Dashboard() {
    const [modal, setModal] = useState(null);


    const totalOrders = orders.length;
    const totalCompleted = orders.filter(o => o.status === "Completed").length;
    const totalCancelled = orders.filter(o => o.status === "Cancelled").length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const totalCustomers = customers.length;
    const activeMembers = customers.filter(c => c.loyalty !== "None" && c.points > 0).length;


    // Simulasi data chart per bulan (6 bulan terakhir)
    const monthLabels = ["Nov", "Des", "Jan", "Feb", "Mar", "Apr"];
    const revenueData = [18500000, 22000000, 19800000, 25000000, 23400000, totalRevenue];
    const orderTrendData = [22, 28, 24, 32, 29, totalOrders];
    const sparkOrders = [22, 28, 24, 32, 29, totalOrders];
    const sparkRevenue = [185, 220, 198, 250, 234, Math.round(totalRevenue / 100000)];


    const pieSegments = [
        { label: "Completed", value: totalCompleted, color: "#7B1C1C" },
        { label: "Pending", value: orders.filter(o => o.status === "Pending").length, color: "#D97706" },
        { label: "Cancelled", value: totalCancelled, color: "#E5E7EB" },
    ];


    const topCustomers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);


    return (
        <div style={{ background: "#F7F7F7", minHeight: "100vh", padding: "0 0 32px 0" }}>
            <PageHeader title="Dashboard" breadcrumb={["Home"]} />


            {/* ── Stat Cards ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
                <StatCard icon={<FaShoppingCart />} label="Total Orders" value={totalOrders} sub="Semua waktu" trend={12} sparkData={sparkOrders} onClick={() => setModal({ title: "Total Orders", value: totalOrders })} />
                <StatCard icon={<FaTruck />} label="Selesai" value={totalCompleted} sub="Completed orders" trend={8} sparkData={[18, 22, 20, 26, 23, totalCompleted]} onClick={() => setModal({ title: "Completed Orders", value: totalCompleted })} />
                <StatCard icon={<FaBan />} label="Dibatalkan" value={totalCancelled} sub="Cancelled orders" trend={-3} sparkData={[5, 3, 6, 4, 5, totalCancelled]} accent="#E24B4A" onClick={() => setModal({ title: "Cancelled", value: totalCancelled })} />
                <StatCard icon={<FaDollarSign />} label="Pendapatan" value={`Rp ${(totalRevenue / 1000000).toFixed(1)}jt`} sub="Total revenue" trend={15} sparkData={sparkRevenue} onClick={() => setModal({ title: "Total Revenue", value: `Rp ${totalRevenue.toLocaleString()}` })} />
                <StatCard icon={<FaUsers />} label="Pelanggan" value={totalCustomers} sub="Terdaftar" trend={5} sparkData={[80, 92, 95, 101, 105, totalCustomers]} onClick={() => setModal({ title: "Total Customers", value: totalCustomers })} />
                <StatCard icon={<FaStar />} label="Active Members" value={activeMembers} sub="Loyalty aktif" trend={9} sparkData={[30, 35, 32, 38, 36, activeMembers]} onClick={() => setModal({ title: "Active Members", value: activeMembers })} />
            </div>


            {/* ── Row 2: Bar Chart + Donut ── */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
                {/* Revenue Bar Chart */}
                <div style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", border: "1px solid #EEE" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>Pendapatan Bulanan</div>
                            <div style={{ fontSize: 12, color: "#AAA", marginTop: 2 }}>6 bulan terakhir</div>
                        </div>
                        <span style={{ background: MAROON_MUTED, color: MAROON, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>+15% vs bulan lalu</span>
                    </div>
                    <div style={{ position: "relative", height: 220 }}>
                        <BarChart data={revenueData} labels={monthLabels} />
                    </div>
                    {/* Custom legend */}
                    <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 11, color: "#AAA" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: MAROON, display: "inline-block" }} />Bulan ini</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "#F0C0C0", display: "inline-block" }} />Bulan sebelumnya</span>
                    </div>
                </div>


                {/* Order Status Donut */}
                <div style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", border: "1px solid #EEE" }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>Status Order</div>
                    <div style={{ fontSize: 12, color: "#AAA", marginBottom: 20 }}>Distribusi semua order</div>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                        <div style={{ position: "relative", height: 160, width: 160 }}>
                            <PieChart segments={pieSegments} />
                        </div>
                    </div>
                    {/* Legend */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {pieSegments.map(seg => (
                            <div key={seg.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12 }}>
                                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ width: 10, height: 10, borderRadius: 2, background: seg.color, display: "inline-block" }} />
                                    <span style={{ color: "#666" }}>{seg.label}</span>
                                </span>
                                <span style={{ fontWeight: 600, color: "#333" }}>{seg.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            {/* ── Row 3: Line Chart + Top Customers ── */}
            <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16, marginBottom: 16 }}>
                {/* Order Trend Line */}
                <div style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", border: "1px solid #EEE" }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>Tren Order</div>
                    <div style={{ fontSize: 12, color: "#AAA", marginBottom: 20 }}>Jumlah order per bulan</div>
                    <div style={{ position: "relative", height: 180 }}>
                        <LineChart data={orderTrendData} labels={monthLabels} />
                    </div>
                </div>


                {/* Top Customers */}
                <div style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", border: "1px solid #EEE" }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>Top Pelanggan</div>
                    <div style={{ fontSize: 12, color: "#AAA", marginBottom: 16 }}>Berdasarkan total belanja</div>
                    {topCustomers.map((c, i) => (
                        <TopCustomerItem key={c.id} rank={i + 1} name={c.name} spent={c.totalSpent} tier={c.loyalty} />
                    ))}
                </div>
            </div>


            {/* ── Row 4: Recent Orders ── */}
            <div style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", border: "1px solid #EEE" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>Order Terbaru</div>
                        <div style={{ fontSize: 12, color: "#AAA", marginTop: 2 }}>7 order terkini</div>
                    </div>
                    <a href="/orders" style={{ fontSize: 12, color: MAROON, fontWeight: 600, textDecoration: "none" }}>Lihat semua →</a>
                </div>
                <RecentOrders orders={orders} />
            </div>


            {/* ── Modal ── */}
            {modal && (
                <div
                    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}
                    onClick={() => setModal(null)}
                >
                    <div
                        style={{ background: "#fff", borderRadius: 20, padding: "32px 28px", width: 320, boxShadow: "0 20px 60px rgba(123,28,28,0.2)" }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: MAROON_MUTED, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                            <FaShoppingCart style={{ color: MAROON, fontSize: 20 }} />
                        </div>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", margin: "0 0 4px" }}>{modal.title}</h2>
                        <p style={{ fontSize: 13, color: "#AAA", margin: "0 0 20px" }}>Ringkasan data</p>
                        <div style={{ fontSize: 36, fontWeight: 800, color: MAROON, marginBottom: 24 }}>{modal.value}</div>
                        <button
                            onClick={() => setModal(null)}
                            style={{ width: "100%", background: MAROON, color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                            onMouseEnter={e => e.currentTarget.style.background = MAROON_DARK}
                            onMouseLeave={e => e.currentTarget.style.background = MAROON}
                        >Tutup</button>
                    </div>
                </div>
            )}
        </div>
    );
}

