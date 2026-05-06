import { useEffect, useRef } from "react";
import { FaStar, FaMedal, FaTrophy, FaCrown, FaCookie } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import customers from "../data/customers";
import orders from "../data/orders";

const GOLD = "#D4AF37";

const TIER = {
    Gold:   { icon: <FaCrown />,  bg: "rgba(212, 175, 55, 0.15)", color: "#D4AF37", border: "rgba(212, 175, 55, 0.3)", next: null,  nextPts: null, bar: "#D4AF37" },
    Silver: { icon: <FaTrophy />, bg: "rgba(156, 163, 175, 0.15)", color: "#9CA3AF", border: "rgba(156, 163, 175, 0.3)", next: "Gold",   nextPts: 1000, bar: "#9CA3AF" },
    Bronze: { icon: <FaMedal />,  bg: "rgba(180, 83, 9, 0.15)", color: "#B45309", border: "rgba(180, 83, 9, 0.3)", next: "Silver", nextPts: 500,  bar: "#B45309" },
    None:   { icon: <FaStar />,   bg: "rgba(107, 114, 128, 0.1)", color: "#6B7280", border: "rgba(107, 114, 128, 0.2)", next: "Bronze", nextPts: 100,  bar: "#6B7280" },
};

function TierSummaryCard({ tier, count, icon, bg, color, border }) {
    return (
        <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: "20px 22px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontSize: 22, color }}>{icon}</span>
                <span style={{ fontSize: 32, fontWeight: 800, color }}>{count}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color }}>{tier} Member</div>
            <div style={{ fontSize: 11, color: color + "99" }}>{count} pelanggan aktif</div>
        </div>
    );
}

function ProgressBar({ value, max, color }) {
    const pct = max ? Math.min((value / max) * 100, 100) : 100;
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3 }}>
                <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width 0.6s ease" }} />
            </div>
            <span style={{ fontSize: 11, color: "#9CA3AF", minWidth: 36, textAlign: "right" }}>{Math.round(pct)}%</span>
        </div>
    );
}

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
                    plugins: {
                        legend: { display: false },
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

    return <canvas ref={canvasRef} role="img" aria-label="Donut chart distribusi tier loyalty member" />;
}

// Get customer's favorite item
const getCustomerFavoriteItem = (customerId) => {
    const customerOrders = orders.filter(o => o.customerId === customerId);
    const itemCount = {};
    customerOrders.forEach(order => {
        order.items.forEach(item => {
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
        { label: "Gold",   value: gold,      color: "#D4AF37" },
        { label: "Silver", value: silver,    color: "#9CA3AF" },
        { label: "Bronze", value: bronze,    color: "#B45309" },
        { label: "Non",    value: nonMember, color: "#6B7280" },
    ];

    const membersWithFavorites = members.map(c => ({
        ...c,
        favoriteItem: getCustomerFavoriteItem(c.id)
    }));

    return (
        <div style={{ background: "#0A0C10", minHeight: "100vh", paddingBottom: 32 }}>
            <PageHeader title="Loyalty Program" breadcrumb={["Dashboard", "Loyalty"]} />

            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <TierSummaryCard tier="Gold"   count={gold}      icon={TIER.Gold.icon}   bg={TIER.Gold.bg}   color={TIER.Gold.color}   border={TIER.Gold.border}   />
                <TierSummaryCard tier="Silver" count={silver}    icon={TIER.Silver.icon} bg={TIER.Silver.bg} color={TIER.Silver.color} border={TIER.Silver.border} />
                <TierSummaryCard tier="Bronze" count={bronze}    icon={TIER.Bronze.icon} bg={TIER.Bronze.bg} color={TIER.Bronze.color} border={TIER.Bronze.border} />
                <TierSummaryCard tier="Non"    count={nonMember} icon={TIER.None.icon}   bg={TIER.None.bg}   color={TIER.None.color}   border={TIER.None.border}   />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 16 }}>
                <div style={{ background: "rgba(21, 23, 29, 0.8)", backdropFilter: "blur(12px)", borderRadius: 14, padding: "22px 24px", border: "1px solid rgba(212, 175, 55, 0.2)" }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#F3F4F6", marginBottom: 4 }}>Distribusi Tier</div>
                    <div style={{ fontSize: 12, color: "#D4AF37", marginBottom: 20 }}>Komposisi member saat ini</div>
                    <div style={{ position: "relative", height: 160, marginBottom: 20 }}>
                        <TierDonut data={donutData} />
                        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                            <div style={{ fontSize: 24, fontWeight: 800, color: "#F3F4F6" }}>{members.length}</div>
                            <div style={{ fontSize: 11, color: "#D4AF37" }}>members</div>
                        </div>
                    </div>
                    {donutData.map(d => (
                        <div key={d.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, fontSize: 12 }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ width: 10, height: 10, borderRadius: 2, background: d.color, display: "inline-block" }} />
                                <span style={{ color: "#9CA3AF" }}>{d.label === "Non" ? "Non-Member" : d.label}</span>
                            </span>
                            <span style={{ fontWeight: 700, color: "#F3F4F6" }}>{d.value}</span>
                        </div>
                    ))}
                    <div style={{ marginTop: 16, borderTop: "1px solid rgba(212, 175, 55, 0.15)", paddingTop: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                            <span style={{ color: "#9CA3AF" }}>Total Poin Beredar</span>
                            <span style={{ fontWeight: 700, color: "#D4AF37" }}>{totalPoints.toLocaleString()}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 6 }}>
                            <span style={{ color: "#9CA3AF" }}>Rata-rata Poin</span>
                            <span style={{ fontWeight: 700, color: "#F3F4F6" }}>{avgPoints}</span>
                        </div>
                    </div>
                </div>

                <div style={{ background: "rgba(21, 23, 29, 0.8)", backdropFilter: "blur(12px)", borderRadius: 14, padding: "22px 24px", border: "1px solid rgba(212, 175, 55, 0.2)" }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#F3F4F6", marginBottom: 4 }}>Poin & Progress Member</div>
                    <div style={{ fontSize: 12, color: "#D4AF37", marginBottom: 20 }}>Progress menuju tier berikutnya + menu favorit</div>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead>
                                <tr style={{ background: "rgba(0,0,0,0.2)" }}>
                                    {["Member", "Tier", "Poin", "Menu Favorit", "Progress"].map(h => (
                                        <th key={h} style={{ textAlign: "left", padding: "10px 14px", color: "#D4AF37", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4, borderBottom: "1px solid rgba(212, 175, 55, 0.15)" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {membersWithFavorites.slice(0, 10).map(c => {
                                    const t = TIER[c.loyalty];
                                    const initials = c.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
                                    return (
                                        <tr key={c.id}
                                            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                                            onMouseEnter={e => e.currentTarget.style.background = "rgba(212, 175, 55, 0.05)"}
                                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                        >
                                            <td style={{ padding: "11px 14px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: t.bg, color: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
                                                    <span style={{ fontWeight: 600, color: "#F3F4F6" }}>{c.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: "11px 14px" }}>
                                                <span style={{ background: t.bg, color: t.color, border: `1px solid ${t.border}`, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{c.loyalty}</span>
                                            </td>
                                            <td style={{ padding: "11px 14px", fontWeight: 700, color: "#D4AF37" }}>{c.points}</td>
                                            <td style={{ padding: "11px 14px" }}>
                                                <span style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(212, 175, 55, 0.1)", padding: "3px 10px", borderRadius: 20, width: "fit-content" }}>
                                                    <FaCookie size={10} style={{ color: "#D4AF37" }} />
                                                    <span style={{ fontSize: 12, color: "#D4AF37" }}>{c.favoriteItem}</span>
                                                </span>
                                            </td>
                                            <td style={{ padding: "11px 14px", minWidth: 180 }}>
                                                {t.nextPts ? (
                                                    <div>
                                                        <ProgressBar value={c.points} max={t.nextPts} color={t.bar} />
                                                        <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 3 }}>
                                                            {Math.max(0, t.nextPts - c.points)} poin lagi → {t.next}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span style={{ fontSize: 12, color: "#D4AF37", fontWeight: 700 }}>✦ Tier Tertinggi</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div style={{ background: "rgba(21, 23, 29, 0.8)", backdropFilter: "blur(12px)", borderRadius: 14, padding: "20px 24px", border: "1px solid rgba(212, 175, 55, 0.2)" }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#F3F4F6", marginBottom: 16 }}>Syarat Naik Tier</div>
                <div style={{ display: "flex", gap: 0 }}>
                    {[
                        { tier: "Bronze", pts: "0–499 poin", color: "#B45309", bg: "rgba(180, 83, 9, 0.1)", desc: "Gratis bergabung, dapatkan poin setiap pembelian" },
                        { tier: "Silver", pts: "500–999 poin", color: "#9CA3AF", bg: "rgba(156, 163, 175, 0.1)", desc: "Diskon 5% untuk semua menu, prioritas antrian" },
                        { tier: "Gold",   pts: "1000+ poin", color: "#D4AF37", bg: "rgba(212, 175, 55, 0.1)", desc: "Diskon 10%, akses promo eksklusif, gratis ongkir" },
                    ].map((t, i) => (
                        <div key={t.tier} style={{ flex: 1, background: t.bg, padding: "16px 18px", borderRadius: i === 0 ? "10px 0 0 10px" : i === 2 ? "0 10px 10px 0" : 0, borderRight: i < 2 ? "2px solid #15171D" : "none" }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: t.color }}>{t.tier}</div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: t.color + "99", marginTop: 2 }}>{t.pts}</div>
                            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 8 }}>{t.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}