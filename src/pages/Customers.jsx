import { useState } from "react";
import { FaUserPlus, FaSearch, FaFilter, FaTimes, FaUser } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import customersData from "../data/customers";


const MAROON = "#7B1C1C";
const MAROON_DARK = "#5A1313";
const MAROON_MUTED = "#F9EFEF";


const TIER_STYLE = {
    Gold:   { bg: "#FEF3C7", color: "#92400E", border: "#FCD34D" },
    Silver: { bg: "#F1F5F9", color: "#475569", border: "#CBD5E1" },
    Bronze: { bg: "#FEF0E0", color: "#92400E", border: "#FCA86C" },
    None:   { bg: "#F5F5F5", color: "#9CA3AF", border: "#E5E7EB" },
};


function Avatar({ name }) {
    const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
    return (
        <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: MAROON_MUTED, color: MAROON,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 12, flexShrink: 0,
        }}>{initials}</div>
    );
}


function TierBadge({ tier }) {
    const s = TIER_STYLE[tier] || TIER_STYLE.None;
    return (
        <span style={{
            background: s.bg, color: s.color, border: `1px solid ${s.border}`,
            padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
        }}>{tier === "None" ? "Non-Member" : tier}</span>
    );
}


function StatCard({ label, value, sub }) {
    return (
        <div style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", border: "1px solid #EEE", flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: MAROON }}>{value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#333", marginTop: 2 }}>{label}</div>
            <div style={{ fontSize: 11, color: "#AAA", marginTop: 2 }}>{sub}</div>
        </div>
    );
}


export default function Customers() {
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");
    const [filterTier, setFilterTier] = useState("All");
    const [form, setForm] = useState({ name: "", email: "", phone: "", loyalty: "None" });
    const [sortBy, setSortBy] = useState("name");


    const filtered = customersData
        .filter(c =>
            (filterTier === "All" || c.loyalty === filterTier) &&
            (c.name.toLowerCase().includes(search.toLowerCase()) ||
             c.email.toLowerCase().includes(search.toLowerCase()))
        )
        .sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "spent") return b.totalSpent - a.totalSpent;
            if (sortBy === "points") return b.points - a.points;
            return 0;
        });


    const gold = customersData.filter(c => c.loyalty === "Gold").length;
    const silver = customersData.filter(c => c.loyalty === "Silver").length;
    const bronze = customersData.filter(c => c.loyalty === "Bronze").length;


    return (
        <div style={{ background: "#F7F7F7", minHeight: "100vh", paddingBottom: 32 }}>
            <PageHeader title="Customers" breadcrumb={["Dashboard", "Customers"]}>
                <button
                    onClick={() => setShowModal(true)}
                    style={{ display: "flex", alignItems: "center", gap: 8, background: MAROON, color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = MAROON_DARK}
                    onMouseLeave={e => e.currentTarget.style.background = MAROON}
                >
                    <FaUserPlus size={13} /> Tambah Customer
                </button>
            </PageHeader>


            {/* Stat Summary */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <StatCard label="Total Customers" value={customersData.length} sub="Semua terdaftar" />
                <StatCard label="Gold Members" value={gold} sub="Tier tertinggi" />
                <StatCard label="Silver Members" value={silver} sub="Tier menengah" />
                <StatCard label="Bronze Members" value={bronze} sub="Tier pemula" />
            </div>


            {/* Filter & Search Bar */}
            <div style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", border: "1px solid #EEE", marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                        <FaSearch style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#CCC", fontSize: 13 }} />
                        <input
                            type="text"
                            placeholder="Cari nama atau email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ width: "100%", paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box", color: "#333" }}
                        />
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                        {["All", "Gold", "Silver", "Bronze", "None"].map(tier => (
                            <button key={tier} onClick={() => setFilterTier(tier)}
                                style={{
                                    padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                                    background: filterTier === tier ? MAROON : "#F5F5F5",
                                    color: filterTier === tier ? "#fff" : "#666",
                                    transition: "all 0.15s",
                                }}
                            >{tier === "None" ? "Non-Member" : tier}</button>
                        ))}
                    </div>
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        style={{ padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, color: "#555", outline: "none", cursor: "pointer" }}
                    >
                        <option value="name">Urutkan: Nama</option>
                        <option value="spent">Urutkan: Total Belanja</option>
                        <option value="points">Urutkan: Poin</option>
                    </select>
                </div>
            </div>


            {/* Table */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #EEE", overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid #F0F0F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "#888" }}>Menampilkan <strong style={{ color: "#333" }}>{filtered.length}</strong> dari {customersData.length} pelanggan</span>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: "#FAFAFA" }}>
                                {["Pelanggan", "Email", "Telepon", "Tier", "Poin", "Total Belanja"].map(h => (
                                    <th key={h} style={{ textAlign: "left", padding: "11px 16px", color: "#999", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #F0F0F0" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(c => (
                                <tr key={c.id}
                                    style={{ borderBottom: "1px solid #F9F9F9", transition: "background 0.1s", cursor: "default" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    <td style={{ padding: "12px 16px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <Avatar name={c.name} />
                                            <div>
                                                <div style={{ fontWeight: 600, color: "#222" }}>{c.name}</div>
                                                <div style={{ fontSize: 11, color: "#AAA" }}>ID #{c.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: "12px 16px", color: "#555" }}>{c.email}</td>
                                    <td style={{ padding: "12px 16px", color: "#555" }}>{c.phone}</td>
                                    <td style={{ padding: "12px 16px" }}><TierBadge tier={c.loyalty} /></td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <div style={{ height: 4, width: 60, background: "#F0F0F0", borderRadius: 2 }}>
                                                <div style={{ height: "100%", width: `${Math.min((c.points / 1000) * 100, 100)}%`, background: MAROON, borderRadius: 2 }} />
                                            </div>
                                            <span style={{ fontWeight: 600, color: "#333" }}>{c.points}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: "12px 16px", fontWeight: 700, color: MAROON }}>Rp {c.totalSpent.toLocaleString()}</td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#CCC", fontSize: 14 }}>
                                        <FaUser size={32} style={{ display: "block", margin: "0 auto 12px", opacity: 0.3 }} />
                                        Tidak ada pelanggan ditemukan
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* Modal Tambah Customer */}
            {showModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}
                    onClick={() => setShowModal(false)}>
                    <div style={{ background: "#fff", borderRadius: 20, padding: "28px", width: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
                        onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Tambah Customer</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#AAA" }}><FaTimes size={16} /></button>
                        </div>
                        {[
                            { label: "Nama Lengkap", key: "name", type: "text", placeholder: "Nama pelanggan" },
                            { label: "Email", key: "email", type: "email", placeholder: "email@example.com" },
                            { label: "No. Telepon", key: "phone", type: "text", placeholder: "08xx-xxxx-xxxx" },
                        ].map(f => (
                            <div key={f.key} style={{ marginBottom: 14 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>{f.label}</label>
                                <input type={f.type} placeholder={f.placeholder}
                                    value={form[f.key]}
                                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                            </div>
                        ))}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>Tier Loyalitas</label>
                            <div style={{ display: "flex", gap: 8 }}>
                                {["None", "Bronze", "Silver", "Gold"].map(t => (
                                    <button key={t} onClick={() => setForm({ ...form, loyalty: t })}
                                        style={{
                                            flex: 1, padding: "8px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                                            border: form.loyalty === t ? `2px solid ${MAROON}` : "1px solid #E5E7EB",
                                            background: form.loyalty === t ? MAROON_MUTED : "#fff",
                                            color: form.loyalty === t ? MAROON : "#666",
                                        }}
                                    >{t}</button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => setShowModal(false)}
                            style={{ width: "100%", background: MAROON, color: "#fff", border: "none", borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                            onMouseEnter={e => e.currentTarget.style.background = MAROON_DARK}
                            onMouseLeave={e => e.currentTarget.style.background = MAROON}
                        >Simpan Customer</button>
                    </div>
                </div>
            )}
        </div>
    );
}

