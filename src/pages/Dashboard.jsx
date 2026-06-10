// [COM] Dashboard page - WITH SHADCN TABS (Dengan Warna Aktif)
import { FaShoppingCart, FaTruck, FaBan, FaDollarSign, FaUsers, FaStar, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import TopProductsChart from "../components/TopProductsChart";
import customers from "../data/customers";
import orders from "../data/orders";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PRIMARY = "#5E81F4";
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
                            ticks: { color: "#8181A5", font: { size: 11 }, callback: v => "Rp " + (v / 1000000).toFixed(0) + "jt" }
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
                        x: { grid: { display: false }, ticks: { color: "#8181A5", font: { size: 11 } } },
                        y: { grid: { color: "#F0F0F3" }, ticks: { color: "#8181A5", font: { size: 11 } } }
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
    return (
        <div style={{ width: "100%", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ borderBottom: "1px solid #F0F0F3", background: "#FAFBFD" }}>
                        <th style={{ padding: "14px 12px", textAlign: "left", fontSize: 12, color: "#8181A5", fontWeight: 600 }}>ID</th>
                        <th style={{ padding: "14px 12px", textAlign: "left", fontSize: 12, color: "#8181A5", fontWeight: 600 }}>Customer</th>
                        <th style={{ padding: "14px 12px", textAlign: "left", fontSize: 12, color: "#8181A5", fontWeight: 600 }}>Items</th>
                        <th style={{ padding: "14px 12px", textAlign: "left", fontSize: 12, color: "#8181A5", fontWeight: 600 }}>Status</th>
                        <th style={{ padding: "14px 12px", textAlign: "left", fontSize: 12, color: "#8181A5", fontWeight: 600 }}>Total</th>
                        <th style={{ padding: "14px 12px", textAlign: "left", fontSize: 12, color: "#8181A5", fontWeight: 600 }}>Tanggal</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.slice(0, 7).map(o => (
                        <tr key={o.id} style={{ borderBottom: "1px solid #F0F0F3" }}>
                            <td style={{ padding: "14px 12px", color: "#8181A5", fontFamily: "monospace", fontSize: 12 }}>#{o.id}</td>
                            <td style={{ padding: "14px 12px", fontWeight: 500, color: "#464A5F", fontSize: 13 }}>{o.customerName}</td>
                            <td style={{ padding: "14px 12px" }}>
                                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                    {o.items?.slice(0, 2).map((item, idx) => (
                                        <span key={idx} style={{ background: "rgba(94, 129, 244, 0.1)", color: PRIMARY, padding: "3px 10px", borderRadius: 20, fontSize: 10 }}>{item}</span>
                                    ))}
                                    {o.items?.length > 2 && <span style={{ fontSize: 10, color: "#AAABB0" }}>+{o.items.length - 2}</span>}
                                </div>
                            </td>
                            <td style={{ padding: "14px 12px" }}><StatusBadge status={o.status} /></td>
                            <td style={{ padding: "14px 12px", fontWeight: 600, color: PRIMARY, fontSize: 12 }}>Rp {o.totalPrice.toLocaleString()}</td>
                            <td style={{ padding: "14px 12px", color: "#8181A5", fontSize: 12 }}>{o.orderDate}</td>
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
            <div style={{ fontSize: 14, color: PRIMARY, fontWeight: 700, width: 28 }}>{rank}</div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(94, 129, 244, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: PRIMARY }}>{initials}</div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#1A1A1A" }}>{name}</div>
                <div style={{ fontSize: 11, color: PRIMARY }}>Rp {spent.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: "#AAABB0", marginTop: 2 }}>🍞 {favoriteItem}</div>
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
    const [activeTab, setActiveTab] = useState("overview");

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

            {/* TABS dengan WARNA AKTIF */}
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList style={{ 
                    background: "#F0F0F3", 
                    padding: 4, 
                    borderRadius: 14, 
                    width: "fit-content", 
                    marginBottom: 24,
                    display: "inline-flex",
                    gap: 4
                }}>
                    <TabsTrigger 
                        value="overview" 
                        style={{ 
                            borderRadius: 10, 
                            padding: "10px 28px", 
                            fontWeight: 600, 
                            fontSize: 14,
                            transition: "all 0.2s",
                            cursor: "pointer",
                            backgroundColor: activeTab === "overview" ? PRIMARY : "transparent",
                            color: activeTab === "overview" ? "#FFFFFF" : "#8181A5",
                            boxShadow: activeTab === "overview" ? "0 2px 8px rgba(94, 129, 244, 0.3)" : "none"
                        }}
                    >
                        📊 Overview
                    </TabsTrigger>
                    <TabsTrigger 
                        value="recent-orders" 
                        style={{ 
                            borderRadius: 10, 
                            padding: "10px 28px", 
                            fontWeight: 600, 
                            fontSize: 14,
                            transition: "all 0.2s",
                            cursor: "pointer",
                            backgroundColor: activeTab === "recent-orders" ? PRIMARY : "transparent",
                            color: activeTab === "recent-orders" ? "#FFFFFF" : "#8181A5",
                            boxShadow: activeTab === "recent-orders" ? "0 2px 8px rgba(94, 129, 244, 0.3)" : "none"
                        }}
                    >
                        🛒 Recent Orders
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" style={{ marginTop: 0 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
                        <StatCard icon={<FaShoppingCart />} label="Total Orders" value={totalOrders} sub="Semua waktu" onClick={() => setModal({ title: "Total Orders", value: totalOrders })} />
                        <StatCard icon={<FaTruck />} label="Selesai" value={totalCompleted} sub="Completed orders" onClick={() => setModal({ title: "Completed Orders", value: totalCompleted })} />
                        <StatCard icon={<FaBan />} label="Dibatalkan" value={totalCancelled} sub="Cancelled orders" onClick={() => setModal({ title: "Cancelled", value: totalCancelled })} />
                        <StatCard icon={<FaDollarSign />} label="Pendapatan" value={`Rp ${(totalRevenue / 1000000).toFixed(1)}jt`} sub="Total revenue" onClick={() => setModal({ title: "Total Revenue", value: `Rp ${totalRevenue.toLocaleString()}` })} />
                        <StatCard icon={<FaUsers />} label="Pelanggan" value={totalCustomers} sub="Terdaftar" onClick={() => setModal({ title: "Total Customers", value: totalCustomers })} />
                        <StatCard icon={<FaStar />} label="Active Members" value={activeMembers} sub="Loyalty aktif" onClick={() => setModal({ title: "Active Members", value: activeMembers })} />
                    </div>

                    <TopProductsChart products={topSellingItems} />

                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
                        <Card padding="20px 24px">
                            <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>Pendapatan Bulanan</div>
                            <div style={{ fontSize: 12, color: PRIMARY, marginBottom: 20 }}>6 bulan terakhir</div>
                            <div style={{ height: 220 }}>
                                <BarChart data={revenueData} labels={monthLabels} />
                            </div>
                        </Card>

                        <Card padding="20px 24px">
                            <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>Status Order</div>
                            <div style={{ fontSize: 12, color: PRIMARY, marginBottom: 20 }}>Distribusi semua order</div>
                            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                                <PieChart segments={pieSegments} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {pieSegments.map(seg => (
                                    <div key={seg.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12 }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <span style={{ width: 10, height: 10, borderRadius: 2, background: seg.color }} />
                                            <span style={{ color: "#8181A5" }}>{seg.label}</span>
                                        </span>
                                        <span style={{ fontWeight: 600, color: "#1A1A1A" }}>{seg.value}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16, marginBottom: 16 }}>
                        <Card padding="20px 24px">
                            <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>Tren Order</div>
                            <div style={{ fontSize: 12, color: PRIMARY, marginBottom: 20 }}>Jumlah order per bulan</div>
                            <div style={{ height: 180 }}>
                                <LineChart data={orderTrendData} labels={monthLabels} />
                            </div>
                        </Card>

                        <Card padding="20px 24px">
                            <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>⭐ Top Pelanggan</div>
                            <div style={{ fontSize: 12, color: PRIMARY, marginBottom: 16 }}>Berdasarkan total belanja</div>
                            {topCustomers.map((c, i) => (
                                <TopCustomerItem key={c.id} rank={i + 1} name={c.name} spent={c.totalSpent} tier={c.loyalty} favoriteItem={c.favoriteItem} />
                            ))}
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="recent-orders" style={{ marginTop: 0 }}>
                    <Card padding="0">
                        <div style={{ padding: "18px 24px", borderBottom: "1px solid #F0F0F3", fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>
                            📦 Order Terbaru
                        </div>
                        <RecentOrders orders={orders} />
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Modal */}
            {modal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }} onClick={() => setModal(null)}>
                    <div style={{ background: "#FFF", borderRadius: 20, padding: "28px 24px", width: 320, textAlign: "center" }} onClick={e => e.stopPropagation()}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(94, 129, 244, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                            <FaShoppingCart style={{ color: PRIMARY, fontSize: 20 }} />
                        </div>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", margin: "0 0 4px" }}>{modal.title}</h2>
                        <p style={{ fontSize: 13, color: "#8181A5", margin: "0 0 20px" }}>Ringkasan data</p>
                        <div style={{ fontSize: 36, fontWeight: 800, color: PRIMARY, marginBottom: 24 }}>{modal.value}</div>
                        <button onClick={() => setModal(null)} style={{ width: "100%", background: PRIMARY, color: "#FFF", border: "none", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Tutup</button>
                    </div>
                </div>
            )}
        </div>
    );
}