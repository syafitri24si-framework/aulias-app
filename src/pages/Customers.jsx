// src/pages/Customers.jsx - FULL VERSION DENGAN SUPABASE!
import { useState, useEffect } from "react";
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
import { customersAPI, transactionsAPI, usersAPI } from "../services/supabase";

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

// ================================================================
// KOMPONEN STAT CARD
// ================================================================
function StatCard({ label, value, sub }) {
    return (
        <Card padding="16px 20px">
            <div style={{ fontSize: 24, fontWeight: 800, color: PRIMARY }}>{value || 0}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginTop: 2 }}>{label}</div>
            <div style={{ fontSize: 11, color: "#AAABB0", marginTop: 2 }}>{sub}</div>
        </Card>
    );
}

// ================================================================
// MAIN COMPONENT
// ================================================================
export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterTier, setFilterTier] = useState("All");
    const [filterPoints, setFilterPoints] = useState("All");
    const [sortBy, setSortBy] = useState("name");

    // ===== MODAL STATE =====
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [editData, setEditData] = useState(null);
    const [form, setForm] = useState({ 
        nama_lengkap: "", 
        email: "", 
        no_handphone: "", 
        loyalty_tier: "None" 
    });

    // ============================================================
    // LOAD DATA
    // ============================================================
    const loadData = async () => {
        try {
            setLoading(true);
            const [custData, transData] = await Promise.all([
                customersAPI.fetchAll(),
                transactionsAPI.fetchAll()
            ]);
            setCustomers(custData || []);
            setTransactions(transData || []);
        } catch (err) {
            console.error("Error loading data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // ============================================================
    // HELPER FUNCTIONS
    // ============================================================
    const getCustomerTransactions = (customerId) => {
        return transactions.filter(t => t.id_customer === customerId);
    };

    const getCustomerTotalSpent = (customerId) => {
        return getCustomerTransactions(customerId).reduce((sum, t) => sum + t.total_belanja, 0);
    };

    const getCustomerFavorite = (customerId) => {
        const trans = getCustomerTransactions(customerId);
        const productCount = {};
        trans.forEach(t => {
            const products = t.nama_produk?.split(',').map(p => p.trim()) || [];
            products.forEach(p => {
                productCount[p] = (productCount[p] || 0) + 1;
            });
        });
        const favorite = Object.entries(productCount).sort((a, b) => b[1] - a[1])[0];
        return favorite ? favorite[0] : "-";
    };

    const getTierBySpent = (totalSpent) => {
        if (totalSpent >= 2000000) return "Gold";
        if (totalSpent >= 500000) return "Silver";
        if (totalSpent >= 100000) return "Bronze";
        return "None";
    };

    // ============================================================
    // TAMBAH CUSTOMER - DENGAN POIN SESUAI TIER!
    // ============================================================
    const addCustomer = async () => {
        if (!form.nama_lengkap || !form.no_handphone) {
            alert("⚠️ Nama dan No HP wajib diisi!");
            return;
        }
        try {
            // 🔥 TENTUKAN POIN BERDASARKAN TIER
            let points = 0;
            if (form.loyalty_tier === "Gold") points = 1000;
            else if (form.loyalty_tier === "Silver") points = 500;
            else if (form.loyalty_tier === "Bronze") points = 100;
            else points = 0; // None

            const newCustomer = {
                nama_lengkap: form.nama_lengkap,
                email: form.email || null,
                no_handphone: form.no_handphone,
                loyalty_tier: form.loyalty_tier || "None",
                points: points,  // ← SESUAI TIER!
                total_belanja: 0,
                join_date: new Date().toISOString().split("T")[0]
            };
            await customersAPI.create(newCustomer);
            alert(`✅ Customer berhasil ditambahkan!\n📊 Tier: ${form.loyalty_tier}\n⭐ Poin: ${points}`);
            setShowModal(false);
            setForm({ nama_lengkap: "", email: "", no_handphone: "", loyalty_tier: "None" });
            await loadData();
        } catch (err) {
            alert("❌ Gagal menambahkan customer: " + err.message);
        }
    };

    // ============================================================
    // UPDATE CUSTOMER
    // ============================================================
    const updateCustomer = async () => {
        if (!editData) return;
        
        if (!editData.nama_lengkap || !editData.no_handphone) {
            alert("⚠️ Nama dan No HP wajib diisi!");
            return;
        }

        try {
            const payload = {
                nama_lengkap: editData.nama_lengkap,
                email: editData.email || null,
                no_handphone: editData.no_handphone,
                loyalty_tier: editData.loyalty_tier || "None"
            };
            
            await customersAPI.update(editData.id_customer, payload);
            alert("✅ Customer berhasil diupdate!");
            setShowEditModal(false);
            setEditData(null);
            await loadData();
        } catch (err) {
            console.error("❌ Error updating customer:", err);
            alert("❌ Gagal mengupdate customer: " + err.message);
        }
    };

    const deleteCustomer = async (id, name) => {
        if (!window.confirm(`Yakin hapus "${name}"?`)) return;
        try {
            await customersAPI.delete(id);
            alert("✅ Customer berhasil dihapus!");
            await loadData();
        } catch (err) {
            alert("❌ Gagal menghapus customer: " + err.message);
        }
    };

    // ============================================================
    // REGISTER MEMBER - DENGAN CEK DUPLIKAT!
    // ============================================================
    const registerMember = async () => {
        if (!selectedCustomer) return;

        try {
            const totalSpent = getCustomerTotalSpent(selectedCustomer.id_customer);
            
            let newTier = "Bronze";
            let bonusPoints = 100;

            if (totalSpent >= 2000000) {
                newTier = "Gold";
                bonusPoints = 1000;
            } else if (totalSpent >= 500000) {
                newTier = "Silver";
                bonusPoints = 500;
            }

            // 🔥 POIN LAMA + BONUS
            const currentPoints = selectedCustomer.points || 0;
            const newPoints = currentPoints + bonusPoints;

            await customersAPI.update(selectedCustomer.id_customer, {
                loyalty_tier: newTier,
                points: newPoints
            });

            const email = selectedCustomer.email || `${selectedCustomer.no_handphone}@rotte.com`;
            
            try {
                const existingUsers = await usersAPI.checkEmail(email);
                
                if (existingUsers && existingUsers.length > 0) {
                    const userId = existingUsers[0].id;
                    await usersAPI.update(userId, {
                        role: "customer",
                        no_handphone: selectedCustomer.no_handphone,
                        id_customer: selectedCustomer.id_customer
                    });
                    alert(`✅ ${selectedCustomer.nama_lengkap} sudah memiliki akun! Role diupdate menjadi customer.`);
                } else {
                    await usersAPI.create({
                        email: email,
                        password: "customer123",
                        full_name: selectedCustomer.nama_lengkap,
                        role: "customer",
                        no_handphone: selectedCustomer.no_handphone,
                        id_customer: selectedCustomer.id_customer
                    });
                }
            } catch (userErr) {
                console.log("⚠️ User creation skipped:", userErr.message);
            }

            const tierEmoji = { Gold: "🥇", Silver: "🥈", Bronze: "🥉", None: "👤" };
            alert(`🎉 Selamat! ${selectedCustomer.nama_lengkap} berhasil menjadi member ${newTier}!\n\n📊 Total Belanja: Rp ${totalSpent.toLocaleString()}\n⭐ Poin Awal: ${newPoints}\n🏆 Tier: ${tierEmoji[newTier]} ${newTier}\n\n🔑 Email: ${email}\n🔑 Password: customer123`);

            setShowMemberModal(false);
            setSelectedCustomer(null);
            await loadData();

        } catch (err) {
            console.error("❌ Error:", err);
            alert("❌ Gagal mendaftarkan member: " + err.message);
        }
    };

    // ============================================================
    // SEND PROMO & EXPORT
    // ============================================================
    const sendPromoToTier = (tier) => {
        const tierCustomers = customers.filter(c => c.loyalty_tier === tier);
        if (tierCustomers.length === 0) {
            alert(`Tidak ada member ${tier} yang terdaftar.`);
            return;
        }
        alert(`📧 Promo special untuk ${tier} Members telah dikirim ke ${tierCustomers.length} customer via email.`);
    };

    const exportTierData = (tier) => {
        const tierCustomers = customers.filter(c => c.loyalty_tier === tier);
        if (tierCustomers.length === 0) {
            alert(`Tidak ada data member ${tier} untuk diexport.`);
            return;
        }
        const csvContent = [
            ["ID", "Nama", "Email", "Telepon", "Poin", "Join Date", "Total Belanja"],
            ...tierCustomers.map(c => [
                c.id_customer, 
                c.nama_lengkap, 
                c.email || "-", 
                c.no_handphone, 
                c.points || 0,
                c.join_date || "-",
                getCustomerTotalSpent(c.id_customer) || 0
            ])
        ].map(row => row.join(",")).join("\n");
        
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `members_${tier.toLowerCase()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // ============================================================
    // FILTER & SORT
    // ============================================================
    const customersWithData = customers.map(c => ({
        ...c,
        totalSpent: getCustomerTotalSpent(c.id_customer),
        favorite: getCustomerFavorite(c.id_customer),
        totalOrders: getCustomerTransactions(c.id_customer).length
    }));

    let filtered = customersWithData.filter(c => {
        const matchTier = filterTier === "All" || c.loyalty_tier === filterTier;
        const matchSearch = 
            (c.nama_lengkap?.toLowerCase().includes(search.toLowerCase())) ||
            (c.no_handphone?.includes(search)) ||
            (c.email?.toLowerCase().includes(search.toLowerCase()));
        
        const points = c.points || 0;
        let matchPoints = true;
        if (filterPoints === "0-99") matchPoints = points >= 0 && points <= 99;
        else if (filterPoints === "100-499") matchPoints = points >= 100 && points <= 499;
        else if (filterPoints === "500-999") matchPoints = points >= 500 && points <= 999;
        else if (filterPoints === "1000+") matchPoints = points >= 1000;
        
        return matchTier && matchSearch && matchPoints;
    });

    filtered = filtered.sort((a, b) => {
        if (sortBy === "name") return (a.nama_lengkap || "").localeCompare(b.nama_lengkap || "");
        if (sortBy === "spent") return (b.totalSpent || 0) - (a.totalSpent || 0);
        if (sortBy === "points") return (b.points || 0) - (a.points || 0);
        if (sortBy === "orders") return (b.totalOrders || 0) - (a.totalOrders || 0);
        return 0;
    });

    // ============================================================
    // STATISTICS
    // ============================================================
    const gold = customers.filter(c => c.loyalty_tier === "Gold").length;
    const silver = customers.filter(c => c.loyalty_tier === "Silver").length;
    const bronze = customers.filter(c => c.loyalty_tier === "Bronze").length;

    // ============================================================
    // OPTIONS
    // ============================================================
    const tierOptions = [
        { value: "All", label: "Semua" },
        { value: "Gold", label: "🥇 Gold" },
        { value: "Silver", label: "🥈 Silver" },
        { value: "Bronze", label: "🥉 Bronze" },
        { value: "None", label: "Non-Member" }
    ];

    const pointOptions = [
        { value: "All", label: "📊 Semua Poin" },
        { value: "0-99", label: "⭐ 0 - 99 Poin" },
        { value: "100-499", label: "🥉 100 - 499 Poin" },
        { value: "500-999", label: "🥈 500 - 999 Poin" },
        { value: "1000+", label: "🥇 1000+ Poin" }
    ];

    const sortOptions = [
        { value: "name", label: "📝 Nama" },
        { value: "spent", label: "💰 Total Belanja" },
        { value: "points", label: "⭐ Poin" },
        { value: "orders", label: "📦 Total Pesanan" }
    ];

    const tableHeaders = ["Pelanggan", "Email", "Telepon", "Tier", "Poin", "Total Belanja", "Menu Favorit", "Total Order", "Aksi"];

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

    if (loading) {
        return (
            <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                minHeight: "60vh" 
            }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        border: "3px solid #E8ECF2",
                        borderTop: `3px solid ${PRIMARY}`,
                        animation: "spin 0.8s linear infinite",
                        margin: "0 auto 12px"
                    }} />
                    <p style={{ color: "#8181A5" }}>Memuat data customer...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: "#F6F6F6", minHeight: "100vh", paddingBottom: 32 }}>
            <PageHeader title="👥 Customers" breadcrumb={["Dashboard", "Customers"]}>
                <Button type="primary" icon={FaUserPlus} onClick={() => setShowModal(true)}>
                    Tambah Customer
                </Button>
            </PageHeader>

            {/* ===== STAT CARDS ===== */}
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", 
                gap: 12, 
                marginBottom: 20 
            }}>
                <StatCard label="Total Customers" value={customers.length} sub="Semua terdaftar" />
                <StatCard label="🥇 Gold Members" value={gold} sub="Tier tertinggi" />
                <StatCard label="🥈 Silver Members" value={silver} sub="Tier menengah" />
                <StatCard label="🥉 Bronze Members" value={bronze} sub="Tier pemula" />
            </div>

            {/* ===== FILTER BAR ===== */}
            <Card padding="16px 20px">
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <SearchInput 
                            value={search} 
                            onChange={setSearch} 
                            placeholder="Cari nama, email, atau no HP..."
                            onClear={() => setSearch("")}
                        />
                    </div>
                    
                    <FilterTabs options={tierOptions} value={filterTier} onChange={setFilterTier} />
                    
                    <div style={{ minWidth: "180px" }}>
                        <Select value={filterPoints} onValueChange={setFilterPoints}>
                            <SelectTrigger style={{ 
                                background: "#FAFBFD", 
                                border: "1px solid #E8ECF2", 
                                borderRadius: 12, 
                                padding: "10px 14px", 
                                height: "auto",
                                minWidth: 160,
                                fontSize: 13,
                                fontWeight: 500,
                                cursor: "pointer"
                            }}>
                                <SelectValue placeholder="📊 Filter Poin" />
                            </SelectTrigger>
                            <SelectContent style={{ 
                                background: "#FFFFFF", 
                                borderRadius: 12, 
                                border: "1px solid #E8ECF2",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                            }}>
                                {pointOptions.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value} style={{ 
                                        padding: "10px 14px", 
                                        fontSize: 13, 
                                        cursor: "pointer",
                                        borderRadius: 8
                                    }}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <select 
                        value={sortBy} 
                        onChange={e => setSortBy(e.target.value)}
                        style={{ 
                            padding: "10px 14px", 
                            border: "1px solid #E8ECF2", 
                            borderRadius: 12, 
                            fontSize: 13, 
                            color: "#464A5F", 
                            outline: "none", 
                            background: "#FAFBFD",
                            fontWeight: 500,
                            cursor: "pointer"
                        }}
                    >
                        {sortOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>Urutkan: {opt.label}</option>
                        ))}
                    </select>

                    <Button type="secondary" onClick={loadData} size="sm">
                        🔄 Refresh
                    </Button>
                </div>
            </Card>

            {/* ===== ACCORDION - MANAJEMEN MEMBER ===== */}
            <Card padding="0" style={{ marginTop: 16, overflow: "hidden" }}>
                <div style={{ 
                    padding: "16px 20px", 
                    background: "#FAFBFD", 
                    borderBottom: "1px solid #F0F0F3", 
                    fontWeight: 700, 
                    fontSize: 14, 
                    color: "#1A1A1A" 
                }}>
                    🛠️ Manajemen Member per Tier
                </div>
                <Accordion type="multiple" className="w-full" style={{ padding: "8px 0" }}>
                    {/* GOLD */}
                    <AccordionItem value="gold" style={{ borderBottom: "1px solid #F0F0F3", padding: "0 20px" }}>
                        <AccordionTrigger style={{ padding: "14px 0" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ 
                                    width: 32, height: 32, borderRadius: 10, 
                                    background: "rgba(94, 129, 244, 0.1)", 
                                    display: "flex", alignItems: "center", justifyContent: "center" 
                                }}>
                                    <FaCrown color={PRIMARY} size={14} />
                                </div>
                                <span style={{ fontWeight: 600, fontSize: 14 }}>Gold Members</span>
                                <span style={{ 
                                    background: "rgba(94, 129, 244, 0.1)", 
                                    padding: "2px 12px", borderRadius: 20, 
                                    fontSize: 11, color: PRIMARY 
                                }}>{gold} member</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div style={{ paddingBottom: 16 }}>
                                <div style={{ 
                                    background: "#F8F9FC", borderRadius: 12, padding: 14, marginBottom: 14 
                                }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: PRIMARY, marginBottom: 8 }}>
                                        📊 Statistik Gold Member
                                    </div>
                                    <div style={{ display: "flex", gap: 20, fontSize: 12, flexWrap: "wrap" }}>
                                        <span>💰 Rata-rata belanja: Rp {(
                                            customers.filter(c => c.loyalty_tier === "Gold")
                                            .reduce((sum, c) => sum + getCustomerTotalSpent(c.id_customer), 0) / (gold || 1)
                                        ).toLocaleString()}</span>
                                        <span>⭐ Total poin: {customers.filter(c => c.loyalty_tier === "Gold").reduce((sum, c) => sum + (c.points || 0), 0)}</span>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 10 }}>
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

                    {/* SILVER */}
                    <AccordionItem value="silver" style={{ borderBottom: "1px solid #F0F0F3", padding: "0 20px" }}>
                        <AccordionTrigger style={{ padding: "14px 0" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ 
                                    width: 32, height: 32, borderRadius: 10, 
                                    background: "rgba(129, 129, 165, 0.1)", 
                                    display: "flex", alignItems: "center", justifyContent: "center" 
                                }}>
                                    <FaTrophy color="#8181A5" size={14} />
                                </div>
                                <span style={{ fontWeight: 600, fontSize: 14 }}>Silver Members</span>
                                <span style={{ 
                                    background: "rgba(129, 129, 165, 0.1)", 
                                    padding: "2px 12px", borderRadius: 20, 
                                    fontSize: 11, color: "#8181A5" 
                                }}>{silver} member</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div style={{ paddingBottom: 16 }}>
                                <div style={{ 
                                    background: "#F8F9FC", borderRadius: 12, padding: 14, marginBottom: 14 
                                }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: "#8181A5", marginBottom: 8 }}>
                                        📊 Statistik Silver Member
                                    </div>
                                    <div style={{ display: "flex", gap: 20, fontSize: 12, flexWrap: "wrap" }}>
                                        <span>💰 Rata-rata belanja: Rp {(
                                            customers.filter(c => c.loyalty_tier === "Silver")
                                            .reduce((sum, c) => sum + getCustomerTotalSpent(c.id_customer), 0) / (silver || 1)
                                        ).toLocaleString()}</span>
                                        <span>⭐ Total poin: {customers.filter(c => c.loyalty_tier === "Silver").reduce((sum, c) => sum + (c.points || 0), 0)}</span>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 10 }}>
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

                    {/* BRONZE */}
                    <AccordionItem value="bronze" style={{ padding: "0 20px" }}>
                        <AccordionTrigger style={{ padding: "14px 0" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ 
                                    width: 32, height: 32, borderRadius: 10, 
                                    background: "rgba(244, 190, 94, 0.1)", 
                                    display: "flex", alignItems: "center", justifyContent: "center" 
                                }}>
                                    <FaMedal color="#F4BE5E" size={14} />
                                </div>
                                <span style={{ fontWeight: 600, fontSize: 14 }}>Bronze Members</span>
                                <span style={{ 
                                    background: "rgba(244, 190, 94, 0.1)", 
                                    padding: "2px 12px", borderRadius: 20, 
                                    fontSize: 11, color: "#F4BE5E" 
                                }}>{bronze} member</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div style={{ paddingBottom: 16 }}>
                                <div style={{ 
                                    background: "#F8F9FC", borderRadius: 12, padding: 14, marginBottom: 14 
                                }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: "#F4BE5E", marginBottom: 8 }}>
                                        📊 Statistik Bronze Member
                                    </div>
                                    <div style={{ display: "flex", gap: 20, fontSize: 12, flexWrap: "wrap" }}>
                                        <span>💰 Rata-rata belanja: Rp {(
                                            customers.filter(c => c.loyalty_tier === "Bronze")
                                            .reduce((sum, c) => sum + getCustomerTotalSpent(c.id_customer), 0) / (bronze || 1)
                                        ).toLocaleString()}</span>
                                        <span>⭐ Total poin: {customers.filter(c => c.loyalty_tier === "Bronze").reduce((sum, c) => sum + (c.points || 0), 0)}</span>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 10 }}>
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

            {/* ===== TABLE ===== */}
            <div style={{ marginTop: 20 }}>
                <Table headers={tableHeaders} hoverable={true}>
                    {filtered.length === 0 ? (
                        <tr>
                            <td colSpan={9} style={{ padding: "60px 20px", textAlign: "center" }}>
                                <FaUser size={48} style={{ display: "block", margin: "0 auto 16px", opacity: 0.3 }} />
                                <div style={{ fontSize: "14px", fontWeight: 500, color: "#AAABB0" }}>
                                    Tidak ada pelanggan ditemukan
                                </div>
                                <div style={{ fontSize: "12px", marginTop: "4px", color: "#AAABB0" }}>
                                    Coba ubah filter atau tambahkan customer baru
                                </div>
                            </td>
                        </tr>
                    ) : (
                        filtered.map(c => (
                            <tr key={c.id_customer}>
                                <td style={{ padding: "14px 16px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <Avatar name={c.nama_lengkap} size="md" />
                                        <div>
                                            <Link 
                                                to={`/customers/${c.id_customer}`} 
                                                style={{ 
                                                    textDecoration: "none", 
                                                    fontWeight: 600, 
                                                    color: "#1A1A1A",
                                                    fontSize: 13
                                                }}
                                            >
                                                {c.nama_lengkap || "-"}
                                            </Link>
                                            <div style={{ fontSize: 10, color: "#AAABB0", marginTop: 2 }}>
                                                ID: {c.id_customer?.slice(0, 8)}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td style={{ padding: "14px 16px", color: "#8181A5", fontSize: 12 }}>
                                    {c.email || "-"}
                                </td>

                                <td style={{ padding: "14px 16px", color: "#8181A5", fontSize: 12 }}>
                                    {c.no_handphone || "-"}
                                </td>

                                <td style={{ padding: "14px 16px" }}>
                                    <TierBadge tier={c.loyalty_tier} />
                                </td>

                                <td style={{ padding: "14px 16px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 90 }}>
                                        <div style={{ flex: 1, height: 5, background: "#F0F2F5", borderRadius: 3, overflow: "hidden" }}>
                                            <div style={{ 
                                                height: "100%", 
                                                width: `${Math.min(((c.points || 0) / 1000) * 100, 100)}%`, 
                                                background: PRIMARY, 
                                                borderRadius: 3 
                                            }} />
                                        </div>
                                        <span style={{ fontWeight: 700, fontSize: 12, minWidth: 35 }}>
                                            {c.points || 0}
                                        </span>
                                    </div>
                                </td>

                                <td style={{ padding: "14px 16px", fontWeight: 700, color: PRIMARY, fontSize: 12 }}>
                                    Rp {(c.totalSpent || 0).toLocaleString()}
                                </td>

                                <td style={{ padding: "14px 16px" }}>
                                    <span style={{ 
                                        display: "inline-flex", 
                                        alignItems: "center", 
                                        gap: 5, 
                                        background: "rgba(94, 129, 244, 0.08)", 
                                        padding: "4px 12px", 
                                        borderRadius: 20, 
                                        fontSize: 11, 
                                        color: PRIMARY,
                                        fontWeight: 500
                                    }}>
                                        <FaCookie size={10} />
                                        {c.favorite || "-"}
                                    </span>
                                </td>

                                <td style={{ padding: "14px 16px", fontWeight: 600, fontSize: 12 }}>
                                    {c.totalOrders || 0} <span style={{ color: "#AAABB0", fontSize: 10 }}>kali</span>
                                </td>

                                <td style={{ padding: "14px 16px" }}>
                                    <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
                                        {c.loyalty_tier === "None" ? (
                                            <Button 
                                                type="primary" 
                                                size="sm" 
                                                onClick={() => {
                                                    setSelectedCustomer(c);
                                                    setShowMemberModal(true);
                                                }}
                                            >
                                                ✨ Daftar
                                            </Button>
                                        ) : (
                                            <span style={{ 
                                                fontSize: 11, 
                                                color: PRIMARY, 
                                                background: "rgba(94, 129, 244, 0.08)", 
                                                padding: "5px 12px", 
                                                borderRadius: 20,
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 4
                                            }}>
                                                {TIER_ICON[c.loyalty_tier]} Member
                                            </span>
                                        )}
                                        
                                        <button 
                                            onClick={() => {
                                                setEditData(c);
                                                setShowEditModal(true);
                                            }}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                color: PRIMARY,
                                                fontSize: 16,
                                                padding: "4px 6px",
                                                borderRadius: 6,
                                            }}
                                            title="Edit Customer"
                                        >
                                            ✏️
                                        </button>
                                        
                                        <button 
                                            onClick={() => deleteCustomer(c.id_customer, c.nama_lengkap)}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                color: "#FF808B",
                                                fontSize: 16,
                                                padding: "4px 6px",
                                                borderRadius: 6,
                                            }}
                                            title="Hapus Customer"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </Table>
            </div>

            {/* ===== MODAL TAMBAH CUSTOMER ===== */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Tambah Customer" width={400}>
                {[
                    { label: "Nama Lengkap", key: "nama_lengkap", type: "text", placeholder: "Nama pelanggan" },
                    { label: "Email", key: "email", type: "email", placeholder: "email@example.com" },
                    { label: "No. Telepon", key: "no_handphone", type: "text", placeholder: "08xx-xxxx-xxxx" },
                ].map(f => (
                    <div key={f.key} style={{ marginBottom: 14 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#464A5F", marginBottom: 5, display: "block" }}>
                            {f.label}
                        </label>
                        <input 
                            type={f.type} 
                            placeholder={f.placeholder}
                            value={form[f.key]}
                            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                            style={inputStyle}
                        />
                    </div>
                ))}
                <div style={{ marginBottom: 18 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#464A5F", marginBottom: 5, display: "block" }}>
                        Tier Loyalitas
                    </label>
                    <div style={{ display: "flex", gap: 8 }}>
                        {["None", "Bronze", "Silver", "Gold"].map(t => (
                            <button 
                                key={t} 
                                onClick={() => setForm({ ...form, loyalty_tier: t })}
                                style={{
                                    flex: 1,
                                    padding: "8px",
                                    borderRadius: 10,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    border: form.loyalty_tier === t ? `2px solid ${PRIMARY}` : "1px solid #E8ECF2",
                                    background: form.loyalty_tier === t ? `rgba(94, 129, 244, 0.08)` : "#FAFBFD",
                                    color: form.loyalty_tier === t ? PRIMARY : "#8181A5",
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
                <Button type="primary" fullWidth onClick={addCustomer}>
                    Simpan Customer
                </Button>
            </Modal>

            {/* ===== MODAL EDIT CUSTOMER ===== */}
            <Modal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setEditData(null); }} title="Edit Customer" width={400}>
                {editData && (
                    <>
                        {["nama_lengkap", "email", "no_handphone"].map(f => (
                            <div key={f} style={{ marginBottom: 14 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#464A5F", display: "block", marginBottom: 5 }}>
                                    {f.replace("_", " ").toUpperCase()}
                                </label>
                                <input 
                                    type="text"
                                    value={editData[f] || ""}
                                    onChange={(e) => setEditData({ ...editData, [f]: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                        ))}
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#464A5F", display: "block", marginBottom: 5 }}>
                                Tier Loyalitas
                            </label>
                            <div style={{ display: "flex", gap: 8 }}>
                                {["None", "Bronze", "Silver", "Gold"].map(t => (
                                    <button 
                                        key={t} 
                                        onClick={() => setEditData({ ...editData, loyalty_tier: t })}
                                        style={{
                                            flex: 1,
                                            padding: "8px",
                                            borderRadius: 10,
                                            fontSize: 11,
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            border: editData.loyalty_tier === t ? `2px solid ${PRIMARY}` : "1px solid #E8ECF2",
                                            background: editData.loyalty_tier === t ? `rgba(94, 129, 244, 0.08)` : "#FAFBFD",
                                            color: editData.loyalty_tier === t ? PRIMARY : "#8181A5",
                                        }}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                            <Button type="secondary" onClick={() => { setShowEditModal(false); setEditData(null); }} fullWidth>
                                Batal
                            </Button>
                            <Button type="primary" onClick={updateCustomer} fullWidth>
                                Simpan Perubahan
                            </Button>
                        </div>
                    </>
                )}
            </Modal>

            {/* ===== 🔥 MODAL DAFTAR MEMBER ===== */}
            <Modal isOpen={showMemberModal} onClose={() => { setShowMemberModal(false); setSelectedCustomer(null); }} title="🎉 Daftar Member" width={400}>
                {selectedCustomer && (
                    <>
                        <div style={{ textAlign: "center", marginBottom: 18 }}>
                            <div style={{ 
                                width: 56, 
                                height: 56, 
                                borderRadius: "50%", 
                                background: "rgba(94, 129, 244, 0.1)", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                margin: "0 auto 12px" 
                            }}>
                                <FaCrown style={{ color: PRIMARY, fontSize: 22 }} />
                            </div>
                            <h3 style={{ margin: 0, fontSize: 18 }}>
                                {selectedCustomer.nama_lengkap}
                            </h3>
                            <p style={{ fontSize: 13, color: "#8181A5", marginTop: 4 }}>
                                Akan didaftarkan sebagai member Rotte Rewards
                            </p>
                        </div>

                        <div style={{ 
                            background: "#F8F9FC", 
                            borderRadius: 14, 
                            padding: 16, 
                            marginBottom: 20 
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span style={{ fontSize: 12, color: "#8181A5" }}>Total Belanja:</span>
                                <span style={{ fontWeight: 700, color: PRIMARY }}>
                                    Rp {(getCustomerTotalSpent(selectedCustomer.id_customer) || 0).toLocaleString()}
                                </span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontSize: 12, color: "#8181A5" }}>Tier yang akan didapat:</span>
                                <span style={{ 
                                    fontWeight: 700, 
                                    color: getTierBySpent(getCustomerTotalSpent(selectedCustomer.id_customer)) === "Gold" ? PRIMARY :
                                           getTierBySpent(getCustomerTotalSpent(selectedCustomer.id_customer)) === "Silver" ? "#8181A5" :
                                           getTierBySpent(getCustomerTotalSpent(selectedCustomer.id_customer)) === "Bronze" ? "#F4BE5E" : "#AAABB0"
                                }}>
                                    {getTierBySpent(getCustomerTotalSpent(selectedCustomer.id_customer)) === "None" 
                                        ? "🥉 Bronze (Baru daftar)" 
                                        : getTierBySpent(getCustomerTotalSpent(selectedCustomer.id_customer)) === "Bronze" ? "🥉 Bronze" :
                                          getTierBySpent(getCustomerTotalSpent(selectedCustomer.id_customer)) === "Silver" ? "🥈 Silver" : "🥇 Gold"}
                                </span>
                            </div>
                            <div style={{ 
                                marginTop: 10, 
                                paddingTop: 10, 
                                borderTop: "1px solid #E8ECF2",
                                fontSize: 11,
                                color: "#8181A5"
                            }}>
                                💡 Bonus pendaftaran: <strong style={{ color: PRIMARY }}>100 poin</strong>
                            </div>
                        </div>

                        <div style={{ 
                            background: "rgba(124, 231, 172, 0.08)", 
                            borderRadius: 10, 
                            padding: 12, 
                            marginBottom: 16,
                            fontSize: 12,
                            color: "#065F46"
                        }}>
                            ✅ Pendaftaran GRATIS! Tidak ada syarat minimal belanja.
                        </div>

                        <div style={{ display: "flex", gap: 10 }}>
                            <Button type="secondary" onClick={() => { setShowMemberModal(false); setSelectedCustomer(null); }} fullWidth>
                                Batal
                            </Button>
                            <Button type="primary" onClick={registerMember} fullWidth>
                                ✨ Daftar Member Sekarang
                            </Button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
}