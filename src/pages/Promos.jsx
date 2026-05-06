import { useState } from "react";
import { FaPlus, FaTimes, FaTag, FaTruck, FaBoxOpen, FaFire, FaCalendarAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";
import PageHeader from "../components/PageHeader";

const GOLD = "#D4AF37";

const TYPE_STYLE = {
    Bundling: { bg: "rgba(139, 92, 246, 0.15)", color: "#A78BFA", icon: <FaBoxOpen size={13} /> },
    Diskon:   { bg: "rgba(212, 175, 55, 0.15)", color: "#D4AF37", icon: <FaTag size={13} /> },
    Delivery: { bg: "rgba(74, 222, 128, 0.15)", color: "#4ADE80", icon: <FaTruck size={13} /> },
    Flash:    { bg: "rgba(251, 191, 36, 0.15)", color: "#FBBF24", icon: <FaFire size={13} /> },
};

const initialPromos = [
    { id: 1, title: "Beli 2 Roti Coklat Gratis 1", type: "Bundling", validUntil: "2025-05-30", desc: "Berlaku untuk semua varian roti coklat, min. 2 pcs.", active: true, discount: "Free 1 item" },
    { id: 2, title: "Diskon 20% untuk Member Gold", type: "Diskon",   validUntil: "2025-06-15", desc: "Khusus pelanggan tier Gold, berlaku semua produk.", active: true, discount: "20%" },
    { id: 3, title: "Free Delivery min. Rp 50.000",  type: "Delivery", validUntil: "2025-05-31", desc: "Gratis ongkir untuk area Kota, minimum belanja Rp 50k.", active: true, discount: "Free Delivery" },
    { id: 4, title: "Flash Sale Croissant 50% Off",  type: "Flash",   validUntil: "2025-05-20", desc: "Hanya 50 pcs per hari, mulai pukul 08.00 pagi.", active: false, discount: "50%" },
];

function PromoCard({ promo, onToggle, onDelete }) {
    const ts = TYPE_STYLE[promo.type] || TYPE_STYLE.Diskon;
    const isExpired = new Date(promo.validUntil) < new Date();
    const daysLeft = Math.max(0, Math.round((new Date(promo.validUntil) - new Date()) / (1000 * 60 * 60 * 24)));

    return (
        <div style={{
            background: "rgba(21, 23, 29, 0.8)",
            backdropFilter: "blur(12px)",
            borderRadius: 16,
            border: "1px solid rgba(212, 175, 55, 0.2)",
            padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12,
            opacity: !promo.active ? 0.6 : 1,
            transition: "all 0.2s",
        }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#D4AF37"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(212,175,55,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.2)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, background: ts.bg, color: ts.color, padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                        {ts.icon} {promo.type}
                    </span>
                    {isExpired && <span style={{ background: "rgba(248, 113, 113, 0.15)", color: "#F87171", padding: "4px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700 }}>EXPIRED</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button onClick={() => onToggle(promo.id)} style={{ background: "none", border: "none", cursor: "pointer", color: promo.active ? "#D4AF37" : "#6B7280", fontSize: 22, display: "flex" }}>
                        {promo.active ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                    <button onClick={() => onDelete(promo.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 14, display: "flex" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#F87171"}
                        onMouseLeave={e => e.currentTarget.style.color = "#6B7280"}
                    ><FaTimes /></button>
                </div>
            </div>

            <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#F3F4F6", marginBottom: 4 }}>{promo.title}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>{promo.desc}</div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(212, 175, 55, 0.15)", paddingTop: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#9CA3AF" }}>
                    <FaCalendarAlt size={11} />
                    <span>Berlaku hingga {new Date(promo.validUntil).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {!isExpired && promo.active && (
                        <span style={{ fontSize: 11, color: daysLeft <= 7 ? "#F87171" : "#D4AF37" }}>
                            {daysLeft} hari lagi
                        </span>
                    )}
                    <span style={{ background: "rgba(212, 175, 55, 0.15)", color: "#D4AF37", fontWeight: 800, fontSize: 14, padding: "4px 12px", borderRadius: 8 }}>{promo.discount}</span>
                </div>
            </div>
        </div>
    );
}

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

    return (
        <div style={{ background: "#0A0C10", minHeight: "100vh", paddingBottom: 32 }}>
            <PageHeader title="Promo & Diskon" breadcrumb={["Dashboard", "Promos"]}>
                <button
                    onClick={() => setShowModal(true)}
                    style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #D4AF37, #B8942E)", color: "#000", border: "none", borderRadius: 12, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                    <FaPlus size={11} /> Buat Promo
                </button>
            </PageHeader>

            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                {[
                    { label: "Total Promo", value: promos.length, color: "#D4AF37" },
                    { label: "Promo Aktif", value: activeCount, color: "#4ADE80" },
                    { label: "Promo Nonaktif", value: promos.length - activeCount, color: "#6B7280" },
                ].map(s => (
                    <div key={s.label} style={{ flex: 1, background: "rgba(21, 23, 29, 0.8)", backdropFilter: "blur(12px)", borderRadius: 14, padding: "16px 20px", border: "1px solid rgba(212, 175, 55, 0.2)", borderTop: `3px solid ${s.color}` }}>
                        <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 3 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {["All", "Bundling", "Diskon", "Delivery", "Flash"].map(t => (
                    <button key={t} onClick={() => setFilterType(t)}
                        style={{
                            padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                            background: filterType === t ? "#D4AF37" : "rgba(255,255,255,0.05)",
                            color: filterType === t ? "#000" : "#9CA3AF",
                            transition: "all 0.15s",
                        }}
                    >{t}</button>
                ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
                {filtered.map(p => (
                    <PromoCard key={p.id} promo={p} onToggle={handleToggle} onDelete={handleDelete} />
                ))}
                {filtered.length === 0 && (
                    <div style={{ gridColumn: "1/-1", padding: 48, textAlign: "center", color: "#6B7280", background: "rgba(21, 23, 29, 0.8)", borderRadius: 14 }}>
                        <FaTag size={32} style={{ display: "block", margin: "0 auto 12px", opacity: 0.3 }} />
                        Tidak ada promo untuk kategori ini
                    </div>
                )}
            </div>

            {showModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}
                    onClick={() => setShowModal(false)}>
                    <div style={{ background: "#15171D", borderRadius: 20, padding: 28, width: 440, border: "1px solid rgba(212, 175, 55, 0.3)" }}
                        onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#F3F4F6" }}>Buat Promo Baru</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><FaTimes size={16} /></button>
                        </div>
                        {[
                            { label: "Judul Promo", key: "title", type: "text", placeholder: "Contoh: Diskon 10% Weekend" },
                            { label: "Nilai Diskon", key: "discount", type: "text", placeholder: "Contoh: 10% / Free Delivery" },
                            { label: "Deskripsi", key: "desc", type: "text", placeholder: "Syarat & ketentuan singkat" },
                            { label: "Berlaku Hingga", key: "validUntil", type: "date", placeholder: "" },
                        ].map(f => (
                            <div key={f.key} style={{ marginBottom: 13 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#D4AF37", display: "block", marginBottom: 4 }}>{f.label}</label>
                                <input type={f.type} placeholder={f.placeholder}
                                    value={form[f.key]}
                                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                    style={{ width: "100%", padding: "10px 12px", border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", background: "rgba(0,0,0,0.3)", color: "#F3F4F6" }} />
                            </div>
                        ))}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#D4AF37", display: "block", marginBottom: 6 }}>Tipe Promo</label>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {["Diskon", "Bundling", "Delivery", "Flash"].map(t => (
                                    <button key={t} onClick={() => setForm({ ...form, type: t })}
                                        style={{
                                            padding: "7px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer",
                                            border: form.type === t ? `2px solid ${GOLD}` : "1px solid rgba(212, 175, 55, 0.3)",
                                            background: form.type === t ? "rgba(212, 175, 55, 0.15)" : "rgba(0,0,0,0.3)",
                                            color: form.type === t ? GOLD : "#9CA3AF",
                                        }}
                                    >{t}</button>
                                ))}
                            </div>
                        </div>
                        <button onClick={handleSave}
                            style={{ width: "100%", background: "linear-gradient(135deg, #D4AF37, #B8942E)", color: "#000", border: "none", borderRadius: 12, padding: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                        >Simpan Promo</button>
                    </div>
                </div>
            )}
        </div>
    );
}
