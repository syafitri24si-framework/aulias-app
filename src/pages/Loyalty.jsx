// [COM] Import komponen
import { useEffect, useRef } from "react";
import { FaStar, FaMedal, FaTrophy, FaCrown, FaCookie } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Avatar from "../components/Avatar";
import TierBadge from "../components/TierBadge";
import customers from "../data/customers";
import orders from "../data/orders";

const PRIMARY = "#5E81F4";
const WARNING = "#F4BE5E";

// [COM] TIER configuration
const TIER = {
    Gold:   { icon: <FaCrown />,  bg: "rgba(94, 129, 244, 0.1)", color: PRIMARY, border: "rgba(94, 129, 244, 0.3)", next: null,  nextPts: null, bar: PRIMARY },
    Silver: { icon: <FaTrophy />, bg: "rgba(129, 129, 165, 0.1)", color: "#8181A5", border: "rgba(129, 129, 165, 0.3)", next: "Gold",   nextPts: 1000, bar: "#8181A5" },
    Bronze: { icon: <FaMedal />,  bg: "rgba(244, 190, 94, 0.1)", color: WARNING, border: "rgba(244, 190, 94, 0.3)", next: "Silver", nextPts: 500,  bar: WARNING },
    None:   { icon: <FaStar />,   bg: "rgba(170, 171, 176, 0.1)", color: "#AAABB0", border: "rgba(170, 171, 176, 0.2)", next: "Bronze", nextPts: 100,  bar: "#AAABB0" },
};

// [COM] TierSummaryCard component
function TierSummaryCard({ tier, count, icon, bg, color, border }) {
    return (
        <Card padding="20px 22px">
            <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: "20px 22px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ fontSize: 22, color }}>{icon}</span>
                    <span style={{ fontSize: 32, fontWeight: 800, color }}>{count}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color }}>{tier} Member</div>
                <div style={{ fontSize: 11, color: color + "99" }}>{count} pelanggan aktif</div>
            </div>
        </Card>
    );
}

// [COM] ProgressBar component
function ProgressBar({ value, max, color }) {
    const pct = max ? Math.min((value / max) * 100, 100) : 100;
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, height: 6, background: "#F0F0F3", borderRadius: 3 }}>
                <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width 0.6s ease" }} />
            </div>
            <span style={{ fontSize: 11, color: "#8181A5", minWidth: 36, textAlign: "right" }}>{Math.round(pct)}%</span>
        </div>
    );
}

// [COM] TierDonut chart
function TierDonut({ data }) {
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
                    labels: data.map(d => d.label),
                    datasets: [{
                        data: data.map(d => d.value),
                        backgroundColor: data.map(d => d.color),
                        borderWidth: 0,
                        hoverOffset: 8,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "68%",
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
    }, []);

    return <canvas ref={canvasRef} style={{ width: "160px", height: "160px" }} />;
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

export default function Loyalty() {
    const members = customers.filter(c => c.loyalty !== "None");
    const gold   = customers.filter(c => c.loyalty === "Gold").length;
    const silver = customers.filter(c => c.loyalty === "Silver").length;
    const bronze = customers.filter(c => c.loyalty === "Bronze").length;
    const nonMember = customers.filter(c => c.loyalty === "None").length;

    const totalPoints = members.reduce((s, c) => s + c.points, 0);
    const avgPoints = members.length ? Math.round(totalPoints / members.length) : 0;

    const donutData = [
        { label: "Gold",   value: gold,      color: PRIMARY },
        { label: "Silver", value: silver,    color: "#8181A5" },
        { label: "Bronze", value: bronze,    color: WARNING },
        { label: "Non",    value: nonMember, color: "#AAABB0" },
    ];

    const membersWithFavorites = members.map(c => ({ ...c, favoriteItem: getCustomerFavoriteItem(c.id) }));

    return (
        <div style={{ background: "#F6F6F6", minHeight: "100vh", paddingBottom: 32 }}>
            <PageHeader title="Loyalty Program" breadcrumb={["Dashboard", "Loyalty"]} />

            {/* [COM] Tier Summary Cards */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <TierSummaryCard tier="Gold"   count={gold}      icon={TIER.Gold.icon}   bg={TIER.Gold.bg}   color={TIER.Gold.color}   border={TIER.Gold.border}   />
                <TierSummaryCard tier="Silver" count={silver}    icon={TIER.Silver.icon} bg={TIER.Silver.bg} color={TIER.Silver.color} border={TIER.Silver.border} />
                <TierSummaryCard tier="Bronze" count={bronze}    icon={TIER.Bronze.icon} bg={TIER.Bronze.bg} color={TIER.Bronze.color} border={TIER.Bronze.border} />
                <TierSummaryCard tier="Non"    count={nonMember} icon={TIER.None.icon}   bg={TIER.None.bg}   color={TIER.None.color}   border={TIER.None.border}   />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 16 }}>
                {/* [COM] Distribusi Tier - pakai Card */}
                <Card padding="22px 24px">
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>Distribusi Tier</div>
                    <div style={{ fontSize: 12, color: PRIMARY, marginBottom: 20 }}>Komposisi member saat ini</div>
                    <div style={{ position: "relative", height: 160, marginBottom: 20, display: "flex", justifyContent: "center" }}>
                        <TierDonut data={donutData} />
                        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                            <div style={{ fontSize: 24, fontWeight: 800, color: "#1A1A1A" }}>{members.length}</div>
                            <div style={{ fontSize: 11, color: PRIMARY }}>members</div>
                        </div>
                    </div>
                    {donutData.map(d => (
                        <div key={d.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, fontSize: 12 }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ width: 10, height: 10, borderRadius: 2, background: d.color, display: "inline-block" }} />
                                <span style={{ color: "#8181A5" }}>{d.label === "Non" ? "Non-Member" : d.label}</span>
                            </span>
                            <span style={{ fontWeight: 700, color: "#1A1A1A" }}>{d.value}</span>
                        </div>
                    ))}
                    <div style={{ marginTop: 16, borderTop: "1px solid #F0F0F3", paddingTop: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                            <span style={{ color: "#8181A5" }}>Total Poin Beredar</span>
                            <span style={{ fontWeight: 700, color: PRIMARY }}>{totalPoints.toLocaleString()}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 6 }}>
                            <span style={{ color: "#8181A5" }}>Rata-rata Poin</span>
                            <span style={{ fontWeight: 700, color: "#1A1A1A" }}>{avgPoints}</span>
                        </div>
                    </div>
                </Card>

                {/* [COM] Poin & Progress Member - pakai Card */}
                <Card padding="22px 24px">
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>Poin & Progress Member</div>
                    <div style={{ fontSize: 12, color: PRIMARY, marginBottom: 20 }}>Progress menuju tier berikutnya + menu favorit</div>
                    <div style={{ overflowX: "auto" }}>
                        <table className="figma-table">
                            <thead><tr><th>Member</th><th>Tier</th><th>Poin</th><th>Menu Favorit</th><th>Progress</th></tr></thead>
                            <tbody>
                                {membersWithFavorites.slice(0, 10).map(c => {
                                    const t = TIER[c.loyalty];
                                    return (
                                        <tr key={c.id}>
                                            <td>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    {/* [COM] Pakai Avatar */}
                                                    <Avatar name={c.name} size="sm" />
                                                    <span style={{ fontWeight: 600, color: "#1A1A1A" }}>{c.name}</span>
                                                </div>
                                            </td>
                                            {/* [COM] Pakai TierBadge */}
                                            <td><TierBadge tier={c.loyalty} /></td>
                                            <td style={{ fontWeight: 700, color: PRIMARY }}>{c.points}</td>
                                            <td>
                                                <span style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(94, 129, 244, 0.1)", padding: "3px 10px", borderRadius: 20, width: "fit-content" }}>
                                                    <FaCookie size={10} style={{ color: PRIMARY }} />
                                                    <span style={{ fontSize: 12, color: PRIMARY }}>{c.favoriteItem}</span>
                                                </span>
                                            </td>
                                            <td>
                                                {t.nextPts ? (
                                                    <div>
                                                        <ProgressBar value={c.points} max={t.nextPts} color={t.bar} />
                                                        <div style={{ fontSize: 10, color: "#8181A5", marginTop: 3 }}>
                                                            {Math.max(0, t.nextPts - c.points)} poin lagi → {t.next}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span style={{ fontSize: 12, color: PRIMARY, fontWeight: 700 }}>✦ Tier Tertinggi</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* [COM] Syarat Naik Tier - pakai Card */}
            <Card padding="20px 24px">
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 16 }}>Syarat Naik Tier</div>
                <div style={{ display: "flex", gap: 0 }}>
                    {[
                        { tier: "Bronze", pts: "0–499 poin", color: WARNING, bg: "rgba(244, 190, 94, 0.05)", desc: "Gratis bergabung, dapatkan poin setiap pembelian" },
                        { tier: "Silver", pts: "500–999 poin", color: "#8181A5", bg: "rgba(129, 129, 165, 0.05)", desc: "Diskon 5% untuk semua menu, prioritas antrian" },
                        { tier: "Gold",   pts: "1000+ poin", color: PRIMARY, bg: "rgba(94, 129, 244, 0.05)", desc: "Diskon 10%, akses promo eksklusif, gratis ongkir" },
                    ].map((t, i) => (
                        <div key={t.tier} style={{ flex: 1, background: t.bg, padding: "16px 18px", borderRadius: i === 0 ? "10px 0 0 10px" : i === 2 ? "0 10px 10px 0" : 0, borderRight: i < 2 ? "2px solid #FFF" : "none" }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: t.color }}>{t.tier}</div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: t.color + "99", marginTop: 2 }}>{t.pts}</div>
                            <div style={{ fontSize: 12, color: "#8181A5", marginTop: 8 }}>{t.desc}</div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}