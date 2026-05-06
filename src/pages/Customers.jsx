import { useState } from "react";
import { FaUserPlus, FaSearch, FaTimes, FaUser, FaCookie, FaCrown, FaMedal, FaTrophy } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import customersData from "../data/customers";
import orders from "../data/orders";

const GOLD = "#D4AF37";

const TIER_STYLE = {
    Gold:   { bg: "rgba(212, 175, 55, 0.15)", color: "#D4AF37", border: "rgba(212, 175, 55, 0.3)" },
    Silver: { bg: "rgba(156, 163, 175, 0.15)", color: "#9CA3AF", border: "rgba(156, 163, 175, 0.3)" },
    Bronze: { bg: "rgba(180, 83, 9, 0.15)", color: "#B45309", border: "rgba(180, 83, 9, 0.3)" },
    None:   { bg: "rgba(107, 114, 128, 0.1)", color: "#6B7280", border: "rgba(107, 114, 128, 0.2)" },
};

const TIER_ICON = {
    Gold: <FaCrown size={12} />,
    Silver: <FaTrophy size={12} />,
    Bronze: <FaMedal size={12} />,
    None: <FaUser size={12} />,
};

function Avatar({ name }) {
    const initials = name ? name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() : "??";
    return (
        <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "rgba(212, 175, 55, 0.15)", color: "#D4AF37",
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
            padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
            display: "inline-flex", alignItems: "center", gap: 4,
        }}>
            {TIER_ICON[tier]} {tier === "None" ? "Non-Member" : tier}
        </span>
    );
}

function StatCard({ label, value, sub }) {
    return (
        <div style={{ background: "rgba(21, 23, 29, 0.8)", backdropFilter: "blur(12px)", borderRadius: 14, padding: "16px 20px", border: "1px solid rgba(212, 175, 55, 0.2)", flex: 1 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#D4AF37" }}>{value || 0}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#F3F4F6", marginTop: 2 }}>{label}</div>
            <div style={{ fontSize: 11, color: "rgba(212, 175, 55, 0.6)", marginTop: 2 }}>{sub}</div>
        </div>
    );
}

// Hitung total belanja customer dari orders (dengan safe check)
const getCustomerTotalSpent = (customerId) => {
    if (!customerId) return 0;
    const customerOrders = orders.filter(o => o.customerId === customerId);
    const total = customerOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    return total;
};

// Tentukan tier berdasarkan total belanja
const getTierBySpent = (totalSpent) => {
    const spent = totalSpent || 0;
    if (spent >= 2500000) return "Gold";
    if (spent >= 1000000) return "Silver";
    if (spent >= 500000) return "Bronze";
    return "None";
};

// Hitung poin berdasarkan tier
const getPointsByTier = (tier) => {
    switch(tier) {
        case "Gold": return 1000;
        case "Silver": return 500;
        case "Bronze": return 100;
        default: return 0;
    }
};

const getCustomerStats = (customerId) => {
    if (!customerId) return { favoriteItem: "-", totalOrders: 0 };
    const customerOrders = orders.filter(o => o.customerId === customerId);
    const itemCount = {};
    customerOrders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                itemCount[item] = (itemCount[item] || 0) + 1;
            });
        }
    });
    const favorite = Object.entries(itemCount).sort((a, b) => b[1] - a[1])[0];
    return {
        favoriteItem: favorite ? favorite[0] : "-",
        totalOrders: customerOrders.length,
    };
};

export default function Customers() {
    const [customers, setCustomers] = useState(customersData);
    const [showModal, setShowModal] = useState(false);
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [search, setSearch] = useState("");
    const [filterTier, setFilterTier] = useState("All");
    const [form, setForm] = useState({ name: "", email: "", phone: "", loyalty: "None" });
    const [sortBy, setSortBy] = useState("name");

    // Fungsi daftar member (otomatis upgrade berdasarkan total belanja)
    const handleRegisterMember = () => {
        if (!selectedCustomer) return;
        
        const totalSpent = getCustomerTotalSpent(selectedCustomer.id);
        const newTier = getTierBySpent(totalSpent);
        const newPoints = getPointsByTier(newTier);
        
        // Cek apakah customer memenuhi syarat (minimal total belanja 500rb)
        if (totalSpent < 500000) {
            alert(`Maaf, ${selectedCustomer.name} belum memenuhi syarat menjadi member.\nMinimal total belanja Rp 500.000.\nTotal belanja saat ini: Rp ${totalSpent.toLocaleString()}`);
            setShowMemberModal(false);
            setSelectedCustomer(null);
            return;
        }
        
        const updatedCustomers = customers.map(c => 
            c.id === selectedCustomer.id 
                ? { ...c, loyalty: newTier, points: newPoints }
                : c
        );
        setCustomers(updatedCustomers);
        setShowMemberModal(false);
        setSelectedCustomer(null);
        
        alert(`🎉 Selamat! ${selectedCustomer.name} berhasil menjadi member ${newTier}!\nTotal belanja: Rp ${totalSpent.toLocaleString()}\nPoin awal: ${newPoints}`);
    };

    // Update data customer dengan total belanja dari orders
    const customersWithSpent = customers.map(c => {
        const totalFromOrders = getCustomerTotalSpent(c.id);
        return {
            ...c,
            totalSpentFromOrders: totalFromOrders,
            actualTier: c.loyalty !== "None" ? c.loyalty : getTierBySpent(totalFromOrders),
            displayTotalSpent: c.totalSpent || totalFromOrders // pakai yang ada nilainya
        };
    });

    const filtered = customersWithSpent
        .filter(c => {
            if (filterTier === "All") return true;
            if (filterTier === "None") return c.loyalty === "None";
            return c.loyalty === filterTier;
        })
        .filter(c =>
            (c.name && c.name.toLowerCase().includes(search.toLowerCase())) ||
            (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
        )
        .map(c => ({ ...c, ...getCustomerStats(c.id) }))
        .sort((a, b) => {
            if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
            if (sortBy === "spent") return (b.totalSpentFromOrders || 0) - (a.totalSpentFromOrders || 0);
            if (sortBy === "points") return (b.points || 0) - (a.points || 0);
            if (sortBy === "orders") return (b.totalOrders || 0) - (a.totalOrders || 0);
            return 0;
        });

    const gold = customers.filter(c => c.loyalty === "Gold").length;
    const silver = customers.filter(c => c.loyalty === "Silver").length;
    const bronze = customers.filter(c => c.loyalty === "Bronze").length;

    return (
        <div style={{ background: "#0A0C10", minHeight: "100vh", paddingBottom: 32 }}>
            <PageHeader title="Customers" breadcrumb={["Dashboard", "Customers"]}>
                <button
                    onClick={() => setShowModal(true)}
                    style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #D4AF37, #B8942E)", color: "#000", border: "none", borderRadius: 12, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                    <FaUserPlus size={13} /> Tambah Customer
                </button>
            </PageHeader>

            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <StatCard label="Total Customers" value={customers.length} sub="Semua terdaftar" />
                <StatCard label="Gold Members" value={gold} sub="Tier tertinggi" />
                <StatCard label="Silver Members" value={silver} sub="Tier menengah" />
                <StatCard label="Bronze Members" value={bronze} sub="Tier pemula" />
            </div>

            <div style={{ background: "rgba(21, 23, 29, 0.8)", backdropFilter: "blur(12px)", borderRadius: 14, padding: "16px 20px", border: "1px solid rgba(212, 175, 55, 0.2)", marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                        <FaSearch style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: 13 }} />
                        <input
                            type="text"
                            placeholder="Cari nama atau email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ width: "100%", paddingLeft: 36, paddingRight: 12, paddingTop: 10, paddingBottom: 10, border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", color: "#F3F4F6", background: "rgba(0,0,0,0.3)" }}
                        />
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                        {["All", "Gold", "Silver", "Bronze", "None"].map(tier => (
                            <button key={tier} onClick={() => setFilterTier(tier)}
                                style={{
                                    padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                                    background: filterTier === tier ? "#D4AF37" : "rgba(255,255,255,0.05)",
                                    color: filterTier === tier ? "#000" : "#9CA3AF",
                                    transition: "all 0.15s",
                                }}
                            >{tier === "None" ? "Non-Member" : tier}</button>
                        ))}
                    </div>
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        style={{ padding: "8px 12px", border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 10, fontSize: 13, color: "#F3F4F6", outline: "none", cursor: "pointer", background: "rgba(0,0,0,0.3)" }}
                    >
                        <option value="name">Urutkan: Nama</option>
                        <option value="spent">Urutkan: Total Belanja</option>
                        <option value="points">Urutkan: Poin</option>
                        <option value="orders">Urutkan: Total Pesanan</option>
                    </select>
                </div>
            </div>

            <div style={{ background: "rgba(21, 23, 29, 0.8)", backdropFilter: "blur(12px)", borderRadius: 14, border: "1px solid rgba(212, 175, 55, 0.2)", overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(212, 175, 55, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "#9CA3AF" }}>Menampilkan <strong style={{ color: "#D4AF37" }}>{filtered.length}</strong> dari {customers.length} pelanggan</span>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: "rgba(0,0,0,0.2)" }}>
                                {["Pelanggan", "Email", "Telepon", "Tier", "Poin", "Total Belanja", "Menu Favorit", "Total Order", "Aksi"].map(h => (
                                    <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: "#D4AF37", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(212, 175, 55, 0.15)" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(c => (
                                <tr key={c.id}
                                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.1s" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(212, 175, 55, 0.05)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    <td style={{ padding: "12px 16px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <Avatar name={c.name} />
                                            <div>
                                                <div style={{ fontWeight: 600, color: "#F3F4F6" }}>{c.name || "-"}</div>
                                                <div style={{ fontSize: 11, color: "rgba(212, 175, 55, 0.6)" }}>ID #{c.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: "12px 16px", color: "#9CA3AF" }}>{c.email || "-"}</td>
                                    <td style={{ padding: "12px 16px", color: "#9CA3AF" }}>{c.phone || "-"}</td>
                                    <td style={{ padding: "12px 16px" }}><TierBadge tier={c.loyalty} /></td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <div style={{ height: 4, width: 60, background: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
                                                <div style={{ height: "100%", width: `${Math.min(((c.points || 0) / 1000) * 100, 100)}%`, background: "linear-gradient(90deg, #D4AF37, #F5D76E)", borderRadius: 2 }} />
                                            </div>
                                            <span style={{ fontWeight: 600, color: "#F3F4F6" }}>{c.points || 0}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: "12px 16px", fontWeight: 700, color: "#D4AF37" }}>Rp {(c.totalSpentFromOrders || 0).toLocaleString()}</td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(212, 175, 55, 0.1)", padding: "3px 10px", borderRadius: 20, width: "fit-content" }}>
                                            <FaCookie size={10} style={{ color: "#D4AF37" }} />
                                            <span style={{ fontSize: 12, color: "#D4AF37" }}>{c.favoriteItem || "-"}</span>
                                        </span>
                                    </td>
                                    <td style={{ padding: "12px 16px", fontWeight: 600, color: "#F3F4F6" }}>{c.totalOrders || 0} kali</td>
                                    <td style={{ padding: "12px 16px" }}>
                                        {c.loyalty === "None" ? (
                                            <button
                                                onClick={() => {
                                                    setSelectedCustomer(c);
                                                    setShowMemberModal(true);
                                                }}
                                                style={{
                                                    background: "linear-gradient(135deg, #D4AF37, #B8942E)",
                                                    color: "#000",
                                                    border: "none",
                                                    borderRadius: 8,
                                                    padding: "6px 12px",
                                                    fontSize: 11,
                                                    fontWeight: 600,
                                                    cursor: "pointer",
                                                    transition: "all 0.2s",
                                                    whiteSpace: "nowrap"
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                                                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                                            >
                                                ✨ Daftar Member
                                            </button>
                                        ) : (
                                            <span style={{ fontSize: 11, color: "#D4AF37", background: "rgba(212, 175, 55, 0.15)", padding: "5px 10px", borderRadius: 8 }}>
                                                {TIER_ICON[c.loyalty]} Member
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={9} style={{ padding: 40, textAlign: "center", color: "#6B7280", fontSize: 14 }}>
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
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}
                    onClick={() => setShowModal(false)}>
                    <div style={{ background: "#15171D", borderRadius: 20, padding: "28px", width: 400, border: "1px solid rgba(212, 175, 55, 0.3)" }}
                        onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#F3F4F6" }}>Tambah Customer</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><FaTimes size={16} /></button>
                        </div>
                        {[
                            { label: "Nama Lengkap", key: "name", type: "text", placeholder: "Nama pelanggan" },
                            { label: "Email", key: "email", type: "email", placeholder: "email@example.com" },
                            { label: "No. Telepon", key: "phone", type: "text", placeholder: "08xx-xxxx-xxxx" },
                        ].map(f => (
                            <div key={f.key} style={{ marginBottom: 14 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#D4AF37", display: "block", marginBottom: 5 }}>{f.label}</label>
                                <input type={f.type} placeholder={f.placeholder}
                                    value={form[f.key]}
                                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                    style={{ width: "100%", padding: "10px 12px", border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", background: "rgba(0,0,0,0.3)", color: "#F3F4F6" }} />
                            </div>
                        ))}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#D4AF37", display: "block", marginBottom: 5 }}>Tier Loyalitas</label>
                            <div style={{ display: "flex", gap: 8 }}>
                                {["None", "Bronze", "Silver", "Gold"].map(t => (
                                    <button key={t} onClick={() => setForm({ ...form, loyalty: t })}
                                        style={{
                                            flex: 1, padding: "8px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer",
                                            border: form.loyalty === t ? `2px solid ${GOLD}` : "1px solid rgba(212, 175, 55, 0.3)",
                                            background: form.loyalty === t ? "rgba(212, 175, 55, 0.15)" : "rgba(0,0,0,0.3)",
                                            color: form.loyalty === t ? GOLD : "#9CA3AF",
                                        }}
                                    >{t}</button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                const newId = Math.max(...customers.map(c => c.id), 0) + 1;
                                const newCustomer = {
                                    id: newId,
                                    name: form.name,
                                    email: form.email,
                                    phone: form.phone,
                                    loyalty: form.loyalty,
                                    points: form.loyalty === "Gold" ? 1000 : form.loyalty === "Silver" ? 500 : form.loyalty === "Bronze" ? 100 : 0,
                                    totalSpent: 0,
                                    joinDate: new Date().toISOString().split("T")[0]
                                };
                                setCustomers([...customers, newCustomer]);
                                setForm({ name: "", email: "", phone: "", loyalty: "None" });
                                setShowModal(false);
                            }}
                            style={{ width: "100%", background: "linear-gradient(135deg, #D4AF37, #B8942E)", color: "#000", border: "none", borderRadius: 12, padding: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                        >Simpan Customer</button>
                    </div>
                </div>
            )}

            {/* Modal Daftar Member */}
            {showMemberModal && selectedCustomer && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}
                    onClick={() => setShowMemberModal(false)}>
                    <div style={{ background: "#15171D", borderRadius: 20, padding: "28px", width: 360, border: "1px solid rgba(212, 175, 55, 0.3)" }}
                        onClick={e => e.stopPropagation()}>
                        <div style={{ textAlign: "center", marginBottom: 20 }}>
                            <div style={{
                                width: 60, height: 60, borderRadius: "50%",
                                background: "rgba(212, 175, 55, 0.15)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                margin: "0 auto 12px"
                            }}>
                                <FaCrown style={{ color: "#D4AF37", fontSize: 24 }} />
                            </div>
                            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#F3F4F6" }}>Daftar Member</h2>
                            <p style={{ margin: "8px 0 0", fontSize: 13, color: "#9CA3AF" }}>
                                {selectedCustomer.name} akan otomatis mendapatkan tier berdasarkan total belanjanya.
                            </p>
                        </div>

                        <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 12, padding: "14px", marginBottom: 24 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                <span style={{ fontSize: 12, color: "#9CA3AF" }}>Total Belanja:</span>
                                <span style={{ fontWeight: 700, color: "#D4AF37" }}>Rp {(getCustomerTotalSpent(selectedCustomer.id) || 0).toLocaleString()}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontSize: 12, color: "#9CA3AF" }}>Tier yang akan didapat:</span>
                                <span style={{ fontWeight: 700, color: "#D4AF37" }}>
                                    {getTierBySpent(getCustomerTotalSpent(selectedCustomer.id)) === "None" ? "Belum memenuhi syarat" : getTierBySpent(getCustomerTotalSpent(selectedCustomer.id))}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 12 }}>
                            <button
                                onClick={() => setShowMemberModal(false)}
                                style={{
                                    flex: 1,
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(212, 175, 55, 0.3)",
                                    borderRadius: 12,
                                    padding: "10px",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "#9CA3AF",
                                    cursor: "pointer"
                                }}
                            >Batal</button>
                            <button
                                onClick={handleRegisterMember}
                                style={{
                                    flex: 1,
                                    background: "linear-gradient(135deg, #D4AF37, #B8942E)",
                                    border: "none",
                                    borderRadius: 12,
                                    padding: "10px",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "#000",
                                    cursor: "pointer"
                                }}
                            >Konfirmasi Daftar Member ✨</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}