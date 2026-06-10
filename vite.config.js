// [COM] Customers page - WITH SHADCN ACCORDION (Admin Friendly)
import { useState } from "react";
import { FaUserPlus, FaUser, FaCookie, FaCrown, FaMedal, FaTrophy, FaEnvelope, FaDownload } from "react-icons/fa";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import SearchInput from "../components/SearchInput";
import FilterTabs from "../components/FilterTabs";
import Modal from "../components/Modal";
import Avatar from "../components/Avatar";
import TierBadge from "../components/TierBadge";
import Table from "../components/Table";
import Card from "../components/Card";
import customersData from "../data/customers";
import orders from "../data/orders";

// [COM] Import Shadcn Accordion
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const PRIMARY = "#5E81F4";

// Icon untuk setiap tier
const TIER_ICON = {
    Gold: <FaCrown size={12} />,
    Silver: <FaTrophy size={12} />,
    Bronze: <FaMedal size={12} />,
    None: <FaUser size={12} />,
};

// Komponen StatCard lokal
function StatCard({ label, value, sub }) {
    return (
        <Card padding="16px 20px">
            <div style={{ fontSize: 24, fontWeight: 800, color: PRIMARY }}>{value || 0}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginTop: 2 }}>{label}</div>
            <div style={{ fontSize: 11, color: "#AAABB0", marginTop: 2 }}>{sub}</div>
        </Card>
    );
}

// Helper functions
const getCustomerTotalSpent = (customerId) => {
    if (!customerId) return 0;
    const customerOrders = orders.filter(o => o.customerId === customerId);
    return customerOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
};

const getTierBySpent = (totalSpent) => {
    const spent = totalSpent || 0;
    if (spent >= 2500000) return "Gold";
    if (spent >= 1000000) return "Silver";
    if (spent >= 500000) return "Bronze";
    return "None";
};

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

    const handleRegisterMember = () => {
        if (!selectedCustomer) return;
        const totalSpent = getCustomerTotalSpent(selectedCustomer.id);
        const newTier = getTierBySpent(totalSpent);
        const newPoints = getPointsByTier(newTier);
        
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

    // Fungsi admin: Kirim promo ke semua member tier tertentu
    const sendPromoToTier = (tier) => {
        const tierCustomers = customers.filter(c => c.loyalty === tier);
        if (tierCustomers.length === 0) {
            alert(`Tidak ada member ${tier} yang terdaftar.`);
            return;
        }
        alert(`📧 Promo special untuk ${tier} Members telah dikirim ke ${tierCustomers.length} customer via email.\n\n(Simulasi - fitur email terintegrasi dengan Mailchimp/SendGrid)`);
    };

    // Fungsi admin: Export data member tier tertentu
    const exportTierData = (tier) => {
        const tierCustomers = customers.filter(c => c.loyalty === tier);
        if (tierCustomers.length === 0) {
            alert(`Tidak ada data member ${tier} untuk diexport.`);
            return;
        }
        const csvContent = [
            ["ID", "Nama", "Email", "Telepon", "Poin", "Join Date"],
            ...tierCustomers.map(c => [c.id, c.name, c.email, c.phone, c.points, c.joinDate])
        ].map(row => row.join(",")).join("\n");
        
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `members_${tier.toLowerCase()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const customersWithSpent = customers.map(c => ({
        ...c,
        totalSpentFromOrders: getCustomerTotalSpent(c.id),
    }));

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

    // Filter tabs options
    const tierOptions = [
        { value: "All", label: "Semua" },
        { value: "Gold", label: "Gold" },
        { value: "Silver", label: "Silver" },
        { value: "Bronze", label: "Bronze" },
        { value: "None", label: "Non-Member" }
    ];

    // Sort options
    const sortOptions = [
        { value: "name", label: "Nama" },
        { value: "spent", label: "Total Belanja" },
        { value: "points", label: "Poin" },
        { value: "orders", label: "Total Pesanan" }
    ];

    // Table headers
    const tableHeaders = [
        "Pelanggan", "Email", "Telepon", "Tier", "Poin", "Total Belanja", "Menu Favorit", "Total Order", "Aksi"
    ];

    const inputStyle = {
        width: "100%",
        border: "1px solid #E8ECF2",
        borderRadius: "12px",
        padding: "12px 14px",
        fontSize: "13px",
        outline: "none",
        boxSizing: "border-box",
        background: "#FAFBFD",
        color: "#464A5F",
        fontFamily: "'Inter', 'Lato', sans-serif",
        transition: "all 0.2s ease"
    };

    return (
        <div style={{ background: "#F6F6F6", minHeight: "100vh", paddingBottom: 32 }}>
            {/* Header */}
            <PageHeader title="Customers" breadcrumb={["Dashboard", "Customers"]}>
                <Button type="primary" icon={FaUserPlus} onClick={() => setShowModal(true)}>
                    Tambah Customer
                </Button>
            </PageHeader>

            {/* Stat Cards */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                <StatCard label="Total Customers" value={customers.length} sub="Semua terdaftar" />
                <StatCard label="Gold Members" value={gold} sub="Tier tertinggi" />
                <StatCard label="Silver Members" value={silver} sub="Tier menengah" />
                <StatCard label="Bronze Members" value={bronze} sub="Tier pemula" />
            </div>

            {/* Filter Bar */}
            <Card padding="16px 20px">
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <SearchInput 
                            value={search} 
                            onChange={setSearch} 
                            placeholder="Cari nama atau email..."
                            onClear={() => setSearch("")}
                        />
                    </div>
                    <FilterTabs options={tierOptions} value={filterTier} onChange={setFilterTier} />
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        style={{
                            padding: "10px 14px",
                            border: "1px solid #E8ECF2",
                            borderRadius: "12px",
                            fontSize: "13px",
                            color: "#464A5F",
                            outline: "none",
                            cursor: "pointer",
                            background: "#FAFBFD",
                            fontWeight: 500
                        }}
                    >
                        {sortOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>Urutkan: {opt.label}</option>
                        ))}
                    </select>
                </div>
            </Card>

            {/* ========== SHADCN ACCORDION - MANAJEMEN MEMBER (ADMIN) ========== */}
            <Card padding="16px 20px" style={{ marginTop: 16 }}>
                <div style={{ marginBottom: 8, fontWeight: 700, fontSize: 14, color: "#1A1A1A" }}>
                    🛠️ Manajemen Member per Tier
                </div>
                <Accordion type="multiple" className="w-full">
                    
                    {/* Gold Members */}
                    <AccordionItem value="gold">
                        <AccordionTrigger>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <FaCrown color={PRIMARY} />
                                <span style={{ fontWeight: 600 }}>Gold Members</span>
                                <span style={{ background: "rgba(94, 129, 244, 0.1)", padding: "2px 10px", borderRadius: 20, fontSize: 11 }}>
                                    {gold} member
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div style={{ padding: "8px 0" }}>
                                <div style={{ background: "#F8F9FC", borderRadius: 12, padding: 12, marginBottom: 12 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: PRIMARY, marginBottom: 8 }}>📊 Statistik Gold Member:</div>
                                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12 }}>
                                        <span>💰 Rata-rata belanja: Rp {(customers.filter(c => c.loyalty === "Gold").reduce((sum, c) => sum + getCustomerTotalSpent(c.id), 0) / (gold || 1)).toLocaleString()}</span>
                                        <span>⭐ Total poin: {customers.filter(c => c.loyalty === "Gold").reduce((sum, c) => sum + (c.points || 0), 0)}</span>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 12 }}>
                                    <Button type="primary" size="sm" onClick={() => sendPromoToTier("Gold")}>
                                        <FaEnvelope style={{ marginRight: 6 }} /> Kirim Promo
                                    </Button>
                                    <Button type="secondary" size="sm" onClick={() => exportTierData("Gold")}>
                                        <FaDownload style={{ marginRight: 6 }} /> Export Data
                                    </Button>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Silver Members */}
                    <AccordionItem value="silver">
                        <AccordionTrigger>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <FaTrophy color="#8181A5" />
                                <span style={{ fontWeight: 600 }}>Silver Members</span>
                                <span style={{ background: "rgba(94, 129, 244, 0.1)", padding: "2px 10px", borderRadius: 20, fontSize: 11 }}>
                                    {silver} member
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div style={{ padding: "8px 0" }}>
                                <div style={{ background: "#F8F9FC", borderRadius: 12, padding: 12, marginBottom: 12 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: "#8181A5", marginBottom: 8 }}>📊 Statistik Silver Member:</div>
                                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12 }}>
                                        <span>💰 Rata-rata belanja: Rp {(customers.filter(c => c.loyalty === "Silver").reduce((sum, c) => sum + getCustomerTotalSpent(c.id), 0) / (silver || 1)).toLocaleString()}</span>
                                        <span>⭐ Total poin: {customers.filter(c => c.loyalty === "Silver").reduce((sum, c) => sum + (c.points || 0), 0)}</span>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 12 }}>
                                    <Button type="primary" size="sm" onClick={() => sendPromoToTier("Silver")}>
                                        <FaEnvelope style={{ marginRight: 6 }} /> Kirim Promo
                                    </Button>
                                    <Button type="secondary" size="sm" onClick={() => exportTierData("Silver")}>
                                        <FaDownload style={{ marginRight: 6 }} /> Export Data
                                    </Button>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Bronze Members */}
                    <AccordionItem value="bronze">
                        <AccordionTrigger>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <FaMedal color="#F4BE5E" />
                                <span style={{ fontWeight: 600 }}>Bronze Members</span>
                                <span style={{ background: "rgba(94, 129, 244, 0.1)", padding: "2px 10px", borderRadius: 20, fontSize: 11 }}>
                                    {bronze} member
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div style={{ padding: "8px 0" }}>
                                <div style={{ background: "#F8F9FC", borderRadius: 12, padding: 12, marginBottom: 12 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: "#F4BE5E", marginBottom: 8 }}>📊 Statistik Bronze Member:</div>
                                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12 }}>
                                        <span>💰 Rata-rata belanja: Rp {(customers.filter(c => c.loyalty === "Bronze").reduce((sum, c) => sum + getCustomerTotalSpent(c.id), 0) / (bronze || 1)).toLocaleString()}</span>
                                        <span>⭐ Total poin: {customers.filter(c => c.loyalty === "Bronze").reduce((sum, c) => sum + (c.points || 0), 0)}</span>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 12 }}>
                                    <Button type="primary" size="sm" onClick={() => sendPromoToTier("Bronze")}>
                                        <FaEnvelope style={{ marginRight: 6 }} /> Kirim Promo
                                    </Button>
                                    <Button type="secondary" size="sm" onClick={() => exportTierData("Bronze")}>
                                        <FaDownload style={{ marginRight: 6 }} /> Export Data
                                    </Button>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
            </Card>
            {/* ========== END OF ACCORDION ========== */}

            {/* Table */}
            <div style={{ marginTop: 20 }}>
                <Table headers={tableHeaders} hoverable={true}>
                    {filtered.length === 0 ? (
                        <tr>
                            <td colSpan={9} style={{ padding: "60px 20px", textAlign: "center" }}>
                                <FaUser size={48} style={{ display: "block", margin: "0 auto 16px", opacity: 0.3 }} />
                                <div style={{ fontSize: "14px", fontWeight: 500, color: "#AAABB0" }}>Tidak ada pelanggan ditemukan</div>
                                <div style={{ fontSize: "12px", marginTop: "4px", color: "#AAABB0" }}>Coba ubah filter atau tambahkan customer baru</div>
                            </td>
                        </tr>
                    ) : (
                        filtered.map(c => (
                            <tr key={c.id}>
                                {/* Kolom Pelanggan */}
                                <td style={{ padding: "16px 20px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                                        <Avatar name={c.name} size="md" />
                                        <div>
                                            <Link 
                                                to={`/customers/${c.id}`} 
                                                style={{ 
                                                    textDecoration: "none", 
                                                    fontWeight: 600, 
                                                    color: "#1A1A1A",
                                                    fontSize: "14px",
                                                    transition: "color 0.2s"
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.color = PRIMARY}
                                                onMouseLeave={e => e.currentTarget.style.color = "#1A1A1A"}
                                            >
                                                {c.name || "-"}
                                            </Link>
                                            <div style={{ fontSize: "11px", color: "#AAABB0", marginTop: "4px" }}>ID #{c.id}</div>
                                        </div>
                                    </div>
                                </td>

                                {/* Email */}
                                <td style={{ padding: "16px 20px", color: "#8181A5", fontSize: "13px" }}>
                                    {c.email || "-"}
                                </td>

                                {/* Telepon */}
                                <td style={{ padding: "16px 20px", color: "#8181A5", fontSize: "13px" }}>
                                    {c.phone || "-"}
                                </td>

                                {/* Tier */}
                                <td style={{ padding: "16px 20px" }}>
                                    <TierBadge tier={c.loyalty} />
                                </td>

                                {/* Poin dengan progress bar */}
                                <td style={{ padding: "16px 20px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "100px" }}>
                                        <div style={{ flex: 1, height: "6px", background: "#F0F2F5", borderRadius: "3px", overflow: "hidden" }}>
                                            <div style={{ 
                                                height: "100%", 
                                                width: `${Math.min(((c.points || 0) / 1000) * 100, 100)}%`, 
                                                background: PRIMARY, 
                                                borderRadius: "3px" 
                                            }} />
                                        </div>
                                        <span style={{ fontWeight: 700, color: "#1A1A1A", fontSize: "13px", minWidth: "35px" }}>
                                            {c.points || 0}
                                        </span>
                                    </div>
                                </td>

                                {/* Total Belanja */}
                                <td style={{ padding: "16px 20px", fontWeight: 700, color: PRIMARY, fontSize: "13px" }}>
                                    Rp {(c.totalSpentFromOrders || 0).toLocaleString()}
                                </td>

                                {/* Menu Favorit */}
                                <td style={{ padding: "16px 20px" }}>
                                    <span style={{ 
                                        display: "inline-flex", 
                                        alignItems: "center", 
                                        gap: "8px", 
                                        background: "rgba(94, 129, 244, 0.08)", 
                                        padding: "6px 14px", 
                                        borderRadius: "24px", 
                                        fontSize: "12px", 
                                        color: PRIMARY,
                                        fontWeight: 500
                                    }}>
                                        <FaCookie size={11} />
                                        {c.favoriteItem || "-"}
                                    </span>
                                </td>

                                {/* Total Order */}
                                <td style={{ padding: "16px 20px", fontWeight: 600, color: "#1A1A1A", fontSize: "13px" }}>
                                    {c.totalOrders || 0} <span style={{ color: "#AAABB0", fontSize: "11px" }}>kali</span>
                                </td>

                                {/* Aksi */}
                                <td style={{ padding: "16px 20px" }}>
                                    {c.loyalty === "None" ? (
                                        <Button 
                                            type="primary" 
                                            size="sm" 
                                            onClick={() => {
                                                setSelectedCustomer(c);
                                                setShowMemberModal(true);
                                            }}
                                        >
                                            ✨ Daftar Member
                                        </Button>
                                    ) : (
                                        <span style={{ 
                                            fontSize: "12px", 
                                            color: PRIMARY, 
                                            background: "rgba(94, 129, 244, 0.08)", 
                                            padding: "7px 14px", 
                                            borderRadius: "24px",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "6px"
                                        }}>
                                            {TIER_ICON[c.loyalty]} Member
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </Table>
            </div>

            {/* Modal Tambah Customer */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Tambah Customer" width={400}>
                {[
                    { label: "Nama Lengkap", key: "name", type: "text", placeholder: "Nama pelanggan" },
                    { label: "Email", key: "email", type: "email", placeholder: "email@example.com" },
                    { label: "No. Telepon", key: "phone", type: "text", placeholder: "08xx-xxxx-xxxx" },
                ].map(f => (
                    <div key={f.key} style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#464A5F", display: "block", marginBottom: 6 }}>
                            {f.label}
                        </label>
                        <input 
                            type={f.type} 
                            placeholder={f.placeholder}
                            value={form[f.key]}
                            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                            style={inputStyle}
                            onFocus={e => e.target.style.borderColor = PRIMARY}
                            onBlur={e => e.target.style.borderColor = "#E8ECF2"}
                        />
                    </div>
                ))}
                <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#464A5F", display: "block", marginBottom: 6 }}>
                        Tier Loyalitas
                    </label>
                    <div style={{ display: "flex", gap: 8 }}>
                        {["None", "Bronze", "Silver", "Gold"].map(t => (
                            <button 
                                key={t} 
                                onClick={() => setForm({ ...form, loyalty: t })}
                                style={{
                                    flex: 1,
                                    padding: "10px",
                                    borderRadius: 12,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    border: form.loyalty === t ? `2px solid ${PRIMARY}` : "1px solid #E8ECF2",
                                    background: form.loyalty === t ? `rgba(94, 129, 244, 0.08)` : "#FAFBFD",
                                    color: form.loyalty === t ? PRIMARY : "#8181A5",
                                    transition: "all 0.2s"
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
                <Button 
                    type="primary" 
                    fullWidth 
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
                >
                    Simpan Customer
                </Button>
            </Modal>

            {/* Modal Daftar Member */}
            <Modal isOpen={showMemberModal} onClose={() => setShowMemberModal(false)} title="Daftar Member" width={360}>
                {selectedCustomer && (
                    <>
                        <div style={{ textAlign: "center", marginBottom: 20 }}>
                            <div style={{ 
                                width: 60, 
                                height: 60, 
                                borderRadius: "50%", 
                                background: "rgba(94, 129, 244, 0.1)", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                margin: "0 auto 12px" 
                            }}>
                                <FaCrown style={{ color: PRIMARY, fontSize: 24 }} />
                            </div>
                            <p style={{ margin: "8px 0 0", fontSize: 13, color: "#8181A5" }}>
                                {selectedCustomer.name} akan otomatis mendapatkan tier berdasarkan total belanjanya.
                            </p>
                        </div>
                        <div style={{ background: "#F8F9FC", borderRadius: 16, padding: 16, marginBottom: 24 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                <span style={{ fontSize: 12, color: "#8181A5" }}>Total Belanja:</span>
                                <span style={{ fontWeight: 700, color: PRIMARY }}>
                                    Rp {(getCustomerTotalSpent(selectedCustomer.id) || 0).toLocaleString()}
                                </span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontSize: 12, color: "#8181A5" }}>Tier yang akan didapat:</span>
                                <span style={{ fontWeight: 700, color: PRIMARY }}>
                                    {getTierBySpent(getCustomerTotalSpent(selectedCustomer.id)) === "None" 
                                        ? "Belum memenuhi syarat" 
                                        : getTierBySpent(getCustomerTotalSpent(selectedCustomer.id))}
                                </span>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                            <Button type="secondary" onClick={() => setShowMemberModal(false)} fullWidth>
                                Batal
                            </Button>
                            <Button type="primary" onClick={handleRegisterMember} fullWidth>
                                Konfirmasi Daftar Member ✨
                            </Button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
}