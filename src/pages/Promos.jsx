// [COM] Import komponen
import { useState } from "react";
import { FaPlus, FaTag, FaTruck, FaBoxOpen, FaFire, FaCalendarAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import FilterTabs from "../components/FilterTabs";
import Modal from "../components/Modal";
import Card from "../components/Card";
import SummaryCard from "../components/SummaryCard";

const PRIMARY = "#5E81F4";
const SUCCESS = "#7CE7AC";

const TYPE_STYLE = {
    Bundling: { bg: "rgba(139, 92, 246, 0.1)", color: "#A78BFA", icon: <FaBoxOpen size={13} /> },
    Diskon:   { bg: "rgba(94, 129, 244, 0.1)", color: PRIMARY, icon: <FaTag size={13} /> },
    Delivery: { bg: "rgba(124, 231, 172, 0.1)", color: SUCCESS, icon: <FaTruck size={13} /> },
    Flash:    { bg: "rgba(244, 190, 94, 0.1)", color: "#F4BE5E", icon: <FaFire size={13} /> },
};

const initialPromos = [
    { id: 1, title: "Beli 2 Roti Coklat Gratis 1", type: "Bundling", validUntil: "2025-05-30", desc: "Berlaku untuk semua varian roti coklat, min. 2 pcs.", active: true, discount: "Free 1 item" },
    { id: 2, title: "Diskon 20% untuk Member Gold", type: "Diskon",   validUntil: "2025-06-15", desc: "Khusus pelanggan tier Gold, berlaku semua produk.", active: true, discount: "20%" },
    { id: 3, title: "Free Delivery min. Rp 50.000",  type: "Delivery", validUntil: "2025-05-31", desc: "Gratis ongkir untuk area Kota, minimum belanja Rp 50k.", active: true, discount: "Free Delivery" },
    { id: 4, title: "Flash Sale Croissant 50% Off",  type: "Flash",   validUntil: "2025-05-20", desc: "Hanya 50 pcs per hari, mulai pukul 08.00 pagi.", active: false, discount: "50%" },
];

// [COM] PromoCard component
function PromoCard({ promo, onToggle, onDelete }) {
    const ts = TYPE_STYLE[promo.type] || TYPE_STYLE.Diskon;
    const isExpired = new Date(promo.validUntil) < new Date();
    const daysLeft = Math.max(0, Math.round((new Date(promo.validUntil) - new Date()) / (1000 * 60 * 60 * 24)));

    return (
        <Card padding="20px 22px" hoverable>
            <div style={{ opacity: !promo.active ? 0.6 : 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 5, background: ts.bg, color: ts.color, padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                            {ts.icon} {promo.type}
                        </span>
                        {isExpired && <span style={{ background: "rgba(255, 128, 139, 0.1)", color: "#FF808B", padding: "4px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700 }}>EXPIRED</span>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <button onClick={() => onToggle(promo.id)} style={{ background: "none", border: "none", cursor: "pointer", color: promo.active ? PRIMARY : "#AAABB0", fontSize: 22, display: "flex" }}>
                            {promo.active ? <FaToggleOn /> : <FaToggleOff />}
                        </button>
                        <button onClick={() => onDelete(promo.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#AAABB0", fontSize: 14, display: "flex" }}>
                            <FaTag size={14} />
                        </button>
                    </div>
                </div>

                <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>{promo.title}</div>
                    <div style={{ fontSize: 12, color: "#8181A5" }}>{promo.desc}</div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F0F0F3", paddingTop: 12, marginTop: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#8181A5" }}>
                        <FaCalendarAlt size={11} />
                        <span>Berlaku hingga {new Date(promo.validUntil).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {!isExpired && promo.active && (
                            <span style={{ fontSize: 11, color: daysLeft <= 7 ? "#FF808B" : PRIMARY }}>
                                {daysLeft} hari lagi
                            </span>
                        )}
                        <span style={{ background: "rgba(94, 129, 244, 0.1)", color: PRIMARY, fontWeight: 800, fontSize: 14, padding: "4px 12px", borderRadius: 8 }}>{promo.discount}</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}

const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ECECF2",
    borderRadius: 10,
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
    background: "#FFFFFF",
    color: "#464A5F",
    fontFamily: "'Lato', sans-serif"
};

export default function Promos() {
    const [promos, setPromos] = useState(initialPromos);
    const [showModal, setShowModal] = useState(false);
    const [filterType, setFilterType] = useState("All");
    const [form, setForm] = useState({ title: "", type: "Diskon", validUntil: "", desc: "", discount: "" });

    const filtered = promos.filter(p => filterType === "All" || p.type === filterType);
    const activeCount = promos.filter(p => p.active).length;

    const handleToggle = (id) => setPromos(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
    const handleDelete = (id) => setPromos(prev => prev.filter(p => p.id !== id));
    const handleSave = () => {
        if (!form.title || !form.discount) return;
        setPromos(prev => [...prev, { ...form, id: Date.now(), active: true }]);
        setForm({ title: "", type: "Diskon", validUntil: "", desc: "", discount: "" });
        setShowModal(false);
    };

    // [COM] Filter options
    const typeOptions = [
        { value: "All", label: "Semua" },
        { value: "Bundling", label: "Bundling" },
        { value: "Diskon", label: "Diskon" },
        { value: "Delivery", label: "Delivery" },
        { value: "Flash", label: "Flash" }
    ];

    return (
        <div style={{ background: "#F6F6F6", minHeight: "100vh", paddingBottom: 32 }}>
            <PageHeader title="Promo & Diskon" breadcrumb={["Dashboard", "Promos"]}>
                <Button type="primary" icon={FaPlus} onClick={() => setShowModal(true)}>
                    Buat Promo
                </Button>
            </PageHeader>

            {/* [COM] Stats Summary */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <SummaryCard label="Total Promo" value={promos.length} color={PRIMARY} />
                <SummaryCard label="Promo Aktif" value={activeCount} color={SUCCESS} />
                <SummaryCard label="Promo Nonaktif" value={promos.length - activeCount} color="#AAABB0" />
            </div>

            {/* [COM] Filter Tabs */}
            <div style={{ marginBottom: 16 }}>
                <FilterTabs options={typeOptions} value={filterType} onChange={setFilterType} />
            </div>

            {/* [COM] Promo Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
                {filtered.map(p => (
                    <PromoCard key={p.id} promo={p} onToggle={handleToggle} onDelete={handleDelete} />
                ))}
                {filtered.length === 0 && (
                    <Card padding="48px">
                        <div style={{ textAlign: "center", color: "#AAABB0" }}>
                            <FaTag size={32} style={{ display: "block", margin: "0 auto 12px", opacity: 0.3 }} />
                            Tidak ada promo untuk kategori ini
                        </div>
                    </Card>
                )}
            </div>

            {/* [COM] Modal Buat Promo */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Buat Promo Baru" width={440}>
                {[
                    { label: "Judul Promo", key: "title", type: "text", placeholder: "Contoh: Diskon 10% Weekend" },
                    { label: "Nilai Diskon", key: "discount", type: "text", placeholder: "Contoh: 10% / Free Delivery" },
                    { label: "Deskripsi", key: "desc", type: "text", placeholder: "Syarat & ketentuan singkat" },
                    { label: "Berlaku Hingga", key: "validUntil", type: "date", placeholder: "" },
                ].map(f => (
                    <div key={f.key} style={{ marginBottom: 13 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#464A5F", display: "block", marginBottom: 4 }}>{f.label}</label>
                        <input 
                            type={f.type} 
                            placeholder={f.placeholder}
                            value={form[f.key]}
                            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                            style={inputStyle}
                        />
                    </div>
                ))}
                <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#464A5F", display: "block", marginBottom: 6 }}>Tipe Promo</label>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {["Diskon", "Bundling", "Delivery", "Flash"].map(t => (
                            <button 
                                key={t} 
                                onClick={() => setForm({ ...form, type: t })}
                                style={{
                                    padding: "7px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer",
                                    border: form.type === t ? `2px solid ${PRIMARY}` : "1px solid #ECECF2",
                                    background: form.type === t ? "rgba(94, 129, 244, 0.1)" : "#FFF",
                                    color: form.type === t ? PRIMARY : "#8181A5",
                                }}
                            >{t}</button>
                        ))}
                    </div>
                </div>
                <Button type="primary" fullWidth onClick={handleSave}>
                    Simpan Promo
                </Button>
            </Modal>
        </div>
    );
}