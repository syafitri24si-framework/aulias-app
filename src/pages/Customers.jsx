// [COM] Customers page - WITH SHADCN ACCORDION & SELECT (Fix Styling)
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

// Import Shadcn Accordion
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

// Import Shadcn Select
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PRIMARY = "#5E81F4";

const TIER_ICON = {
    Gold: <FaCrown size={12} />,
    Silver: <FaTrophy size={12} />,
    Bronze: <FaMedal size={12} />,
    None: <FaUser size={12} />,
};

function StatCard({ label, value, sub }) {
    return (
        <Card padding="16px 20px">
            <div style={{ fontSize: 24, fontWeight: 800, color: PRIMARY }}>{value || 0}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginTop: 2 }}>{label}</div>
            <div style={{ fontSize: 11, color: "#AAABB0", marginTop: 2 }}>{sub}</div>
        </Card>
    );
}

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
    const [filterPoints, setFilterPoints] = useState("All");
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

    const sendPromoToTier = (tier) => {
        const tierCustomers = customers.filter(c => c.loyalty === tier);
        if (tierCustomers.length === 0) {
            alert(`Tidak ada member ${tier} yang terdaftar.`);
            return;
        }
        alert(`📧 Promo special untuk ${tier} Members telah dikirim ke ${tierCustomers.length} customer via email.`);
    };

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

    let filteredByTier = customersWithSpent.filter(c => {
        if (filterTier === "All") return true;
        if (filterTier === "None") return c.loyalty === "None";
        return c.loyalty === filterTier;
    });

    filteredByTier = filteredByTier.filter(c => {
        const points = c.points || 0;
        if (filterPoints === "All") return true;
        if (filterPoints === "0-99") return points >= 0 && points <= 99;
        if (filterPoints === "100-499") return points >= 100 && points <= 499;
        if (filterPoints === "500-999") return points >= 500 && points <= 999;
        if (filterPoints === "1000+") return points >= 1000;
        return true;
    });

    const filtered = filteredByTier
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

    const tierOptions = [
        { value: "All", label: "Semua" },
        { value: "Gold", label: "Gold" },
        { value: "Silver", label: "Silver" },
        { value: "Bronze", label: "Bronze" },
        { value: "None", label: "Non-Member" }
    ];

    const pointOptions = [
        { value: "All", label: "📊 Semua Poin", icon: "📊" },
        { value: "0-99", label: "⭐ 0 - 99 Poin", icon: "⭐" },
        { value: "100-499", label: "🥉 100 - 499 Poin", icon: "🥉" },
        { value: "500-999", label: "🥈 500 - 999 Poin", icon: "🥈" },
        { value: "1000+", label: "🥇 1000+ Poin", icon: "🥇" },
    ];

    const sortOptions = [
        { value: "name", label: "Nama" },
        { value: "spent", label: "Total Belanja" },
        { value: "points", label: "Poin" },
        { value: "orders", label: "Total Pesanan" }
    ];

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
            <PageHeader title="Customers" breadcrumb={["Dashboard", "Customers"]}>
                <Button type="primary" icon={FaUserPlus} onClick={() => setShowModal(true)}>
                    Tambah Customer
                </Button>
            </PageHeader>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
                <StatCard label="Total Customers" value={customers.length} sub="Semua terdaftar" />
                <StatCard label="Gold Members" value={gold} sub="Tier tertinggi" />
                <StatCard label="Silver Members" value={silver} sub="Tier menengah" />
                <StatCard label="Bronze Members" value={bronze} sub="Tier pemula" />
            </div>

            {/* Filter Bar */}
            <Card padding="16px 20px">
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <SearchInput value={search} onChange={setSearch} placeholder="Cari nama atau email..." onClear={() => setSearch("")} />
                    </div>
                    <FilterTabs options={tierOptions} value={filterTier} onChange={setFilterTier} />
                    
                    <div style={{ minWidth: "200px" }}>
                        <Select value={filterPoints} onValueChange={setFilterPoints}>
                            <SelectTrigger style={{ background: "#FAFBFD", border: "1px solid #E8ECF2", borderRadius: 12, padding: "10px 14px", height: "auto", minWidth: 180, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                                <SelectValue placeholder="📊 Filter poin" />
                            </SelectTrigger>
                            <SelectContent>
                                {pointOptions.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value} style={{ padding: "8px 12px", fontSize: 13, cursor: "pointer" }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>{opt.icon} {opt.label}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: "10px 14px", border: "1px solid #E8ECF2", borderRadius: 12, fontSize: 13, color: "#464A5F", background: "#FAFBFD", fontWeight: 500, cursor: "pointer" }}>
                        {sortOptions.map(opt => <option key={opt.value} value={opt.value}>Urutkan: {opt.label}</option>)}
                    </select>
                </div>
            </Card>

            {/* ACCORDION - Versi Sederhana & Rapi */}
            <Card style={{ marginTop: 16, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", background: "#FAFBFD", borderBottom: "1px solid #F0F0F3", fontWeight: 700, fontSize: 14 }}>
                    🛠️ Manajemen Member per Tier
                </div>
                <Accordion type="multiple" className="w-full">
                    
                    <AccordionItem value="gold">
                        <AccordionTrigger className="px-5 py-3 hover:no-underline">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <FaCrown className="text-[#5E81F4]" size={14} />
                                </div>
                                <span className="font-semibold text-sm">Gold Members</span>
                                <span className="bg-blue-100 text-[#5E81F4] px-2 py-0.5 rounded-full text-xs">{gold} member</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-5 pb-4">
                            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                <div className="text-xs font-semibold text-[#5E81F4] mb-2">📊 Statistik Gold Member</div>
                                <div className="flex gap-5 text-xs">
                                    <span>💰 Rata-rata belanja: Rp {(customers.filter(c => c.loyalty === "Gold").reduce((sum, c) => sum + getCustomerTotalSpent(c.id), 0) / (gold || 1)).toLocaleString()}</span>
                                    <span>⭐ Total poin: {customers.filter(c => c.loyalty === "Gold").reduce((sum, c) => sum + (c.points || 0), 0)}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="primary" size="sm" onClick={() => sendPromoToTier("Gold")}><FaEnvelope className="mr-1" size={12} /> Kirim Promo</Button>
                                <Button type="secondary" size="sm" onClick={() => exportTierData("Gold")}><FaDownload className="mr-1" size={12} /> Export Data</Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="silver">
                        <AccordionTrigger className="px-5 py-3 hover:no-underline">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <FaTrophy className="text-[#8181A5]" size={14} />
                                </div>
                                <span className="font-semibold text-sm">Silver Members</span>
                                <span className="bg-gray-100 text-[#8181A5] px-2 py-0.5 rounded-full text-xs">{silver} member</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-5 pb-4">
                            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                <div className="text-xs font-semibold text-[#8181A5] mb-2">📊 Statistik Silver Member</div>
                                <div className="flex gap-5 text-xs">
                                    <span>💰 Rata-rata belanja: Rp {(customers.filter(c => c.loyalty === "Silver").reduce((sum, c) => sum + getCustomerTotalSpent(c.id), 0) / (silver || 1)).toLocaleString()}</span>
                                    <span>⭐ Total poin: {customers.filter(c => c.loyalty === "Silver").reduce((sum, c) => sum + (c.points || 0), 0)}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="primary" size="sm" onClick={() => sendPromoToTier("Silver")}><FaEnvelope className="mr-1" size={12} /> Kirim Promo</Button>
                                <Button type="secondary" size="sm" onClick={() => exportTierData("Silver")}><FaDownload className="mr-1" size={12} /> Export Data</Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="bronze">
                        <AccordionTrigger className="px-5 py-3 hover:no-underline">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
                                    <FaMedal className="text-[#F4BE5E]" size={14} />
                                </div>
                                <span className="font-semibold text-sm">Bronze Members</span>
                                <span className="bg-yellow-50 text-[#F4BE5E] px-2 py-0.5 rounded-full text-xs">{bronze} member</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-5 pb-4">
                            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                <div className="text-xs font-semibold text-[#F4BE5E] mb-2">📊 Statistik Bronze Member</div>
                                <div className="flex gap-5 text-xs">
                                    <span>💰 Rata-rata belanja: Rp {(customers.filter(c => c.loyalty === "Bronze").reduce((sum, c) => sum + getCustomerTotalSpent(c.id), 0) / (bronze || 1)).toLocaleString()}</span>
                                    <span>⭐ Total poin: {customers.filter(c => c.loyalty === "Bronze").reduce((sum, c) => sum + (c.points || 0), 0)}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="primary" size="sm" onClick={() => sendPromoToTier("Bronze")}><FaEnvelope className="mr-1" size={12} /> Kirim Promo</Button>
                                <Button type="secondary" size="sm" onClick={() => exportTierData("Bronze")}><FaDownload className="mr-1" size={12} /> Export Data</Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
            </Card>

            {/* Table */}
            <div style={{ marginTop: 20 }}>
                <Table headers={tableHeaders} hoverable={true}>
                    {filtered.length === 0 ? (
                        <tr><td colSpan={9} style={{ padding: "60px 20px", textAlign: "center" }}>
                            <FaUser size={48} style={{ display: "block", margin: "0 auto 16px", opacity: 0.3 }} />
                            <div style={{ fontSize: 14, fontWeight: 500, color: "#AAABB0" }}>Tidak ada pelanggan ditemukan</div>
                            <div style={{ fontSize: 12, marginTop: 4, color: "#AAABB0" }}>Coba ubah filter atau tambahkan customer baru</div>
                        </td></tr>
                    ) : (
                        filtered.map(c => (
                            <tr key={c.id}>
                                <td style={{ padding: "14px 16px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <Avatar name={c.name} size="md" />
                                        <div>
                                            <Link to={`/customers/${c.id}`} style={{ textDecoration: "none", fontWeight: 600, color: "#1A1A1A", fontSize: 13 }}>{c.name || "-"}</Link>
                                            <div style={{ fontSize: 10, color: "#AAABB0", marginTop: 2 }}>ID #{c.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: "14px 16px", color: "#8181A5", fontSize: 12 }}>{c.email || "-"}</td>
                                <td style={{ padding: "14px 16px", color: "#8181A5", fontSize: 12 }}>{c.phone || "-"}</td>
                                <td style={{ padding: "14px 16px" }}><TierBadge tier={c.loyalty} /></td>
                                <td style={{ padding: "14px 16px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 90 }}>
                                        <div style={{ flex: 1, height: 5, background: "#F0F2F5", borderRadius: 3, overflow: "hidden" }}>
                                            <div style={{ height: "100%", width: `${Math.min(((c.points || 0) / 1000) * 100, 100)}%`, background: PRIMARY, borderRadius: 3 }} />
                                        </div>
                                        <span style={{ fontWeight: 700, fontSize: 12, minWidth: 35 }}>{c.points || 0}</span>
                                    </div>
                                </td>
                                <td style={{ padding: "14px 16px", fontWeight: 700, color: PRIMARY, fontSize: 12 }}>Rp {(c.totalSpentFromOrders || 0).toLocaleString()}</td>
                                <td style={{ padding: "14px 16px" }}>
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(94, 129, 244, 0.08)", padding: "4px 12px", borderRadius: 20, fontSize: 11, color: PRIMARY, fontWeight: 500 }}>
                                        <FaCookie size={10} /> {c.favoriteItem || "-"}
                                    </span>
                                </td>
                                <td style={{ padding: "14px 16px", fontWeight: 600, fontSize: 12 }}>{c.totalOrders || 0} <span style={{ color: "#AAABB0", fontSize: 10 }}>kali</span></td>
                                <td style={{ padding: "14px 16px" }}>
                                    {c.loyalty === "None" ? (
                                        <Button type="primary" size="sm" onClick={() => { setSelectedCustomer(c); setShowMemberModal(true); }}>✨ Daftar</Button>
                                    ) : (
                                        <span style={{ fontSize: 11, color: PRIMARY, background: "rgba(94, 129, 244, 0.08)", padding: "5px 12px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 4 }}>{TIER_ICON[c.loyalty]} Member</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </Table>
            </div>

            {/* Modal Tambah Customer (sama seperti sebelumnya) */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Tambah Customer" width={400}>
                {[
                    { label: "Nama Lengkap", key: "name", type: "text", placeholder: "Nama pelanggan" },
                    { label: "Email", key: "email", type: "email", placeholder: "email@example.com" },
                    { label: "No. Telepon", key: "phone", type: "text", placeholder: "08xx-xxxx-xxxx" },
                ].map(f => (
                    <div key={f.key} style={{ marginBottom: 14 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#464A5F", marginBottom: 5, display: "block" }}>{f.label}</label>
                        <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={inputStyle} />
                    </div>
                ))}
                <div style={{ marginBottom: 18 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#464A5F", marginBottom: 5, display: "block" }}>Tier Loyalitas</label>
                    <div style={{ display: "flex", gap: 8 }}>
                        {["None", "Bronze", "Silver", "Gold"].map(t => (
                            <button key={t} onClick={() => setForm({ ...form, loyalty: t })} style={{ flex: 1, padding: "8px", borderRadius: 10, fontSize: 11, fontWeight: 600, cursor: "pointer", border: form.loyalty === t ? `2px solid ${PRIMARY}` : "1px solid #E8ECF2", background: form.loyalty === t ? `rgba(94, 129, 244, 0.08)` : "#FAFBFD", color: form.loyalty === t ? PRIMARY : "#8181A5" }}>{t}</button>
                        ))}
                    </div>
                </div>
                <Button type="primary" fullWidth onClick={() => { const newId = Math.max(...customers.map(c => c.id), 0) + 1; const newCustomer = { id: newId, name: form.name, email: form.email, phone: form.phone, loyalty: form.loyalty, points: form.loyalty === "Gold" ? 1000 : form.loyalty === "Silver" ? 500 : form.loyalty === "Bronze" ? 100 : 0, totalSpent: 0, joinDate: new Date().toISOString().split("T")[0] }; setCustomers([...customers, newCustomer]); setForm({ name: "", email: "", phone: "", loyalty: "None" }); setShowModal(false); }}>Simpan Customer</Button>
            </Modal>

            {/* Modal Daftar Member */}
            <Modal isOpen={showMemberModal} onClose={() => setShowMemberModal(false)} title="Daftar Member" width={360}>
                {selectedCustomer && (
                    <>
                        <div style={{ textAlign: "center", marginBottom: 18 }}>
                            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(94, 129, 244, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}><FaCrown style={{ color: PRIMARY, fontSize: 22 }} /></div>
                            <p style={{ fontSize: 13, color: "#8181A5", margin: 0 }}>{selectedCustomer.name} akan otomatis mendapatkan tier berdasarkan total belanjanya.</p>
                        </div>
                        <div style={{ background: "#F8F9FC", borderRadius: 14, padding: 14, marginBottom: 20 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 12, color: "#8181A5" }}>Total Belanja:</span><span style={{ fontWeight: 700, color: PRIMARY }}>Rp {(getCustomerTotalSpent(selectedCustomer.id) || 0).toLocaleString()}</span></div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 12, color: "#8181A5" }}>Tier yang akan didapat:</span><span style={{ fontWeight: 700, color: PRIMARY }}>{getTierBySpent(getCustomerTotalSpent(selectedCustomer.id)) === "None" ? "Belum memenuhi syarat" : getTierBySpent(getCustomerTotalSpent(selectedCustomer.id))}</span></div>
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                            <Button type="secondary" onClick={() => setShowMemberModal(false)} fullWidth>Batal</Button>
                            <Button type="primary" onClick={handleRegisterMember} fullWidth>Konfirmasi Daftar Member ✨</Button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
}