// src/pages/Promos.jsx - LENGKAP DENGAN SUPABASE
import { useState, useEffect } from "react";
import { FaPlus, FaTag, FaTruck, FaBoxOpen, FaFire, FaCalendarAlt, FaToggleOn, FaToggleOff, FaTrash } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import FilterTabs from "../components/FilterTabs";
import Modal from "../components/Modal";
import Card from "../components/Card";
import SummaryCard from "../components/SummaryCard";
import { promosAPI } from "../services/supabase";

const PRIMARY = "#5E81F4";
const SUCCESS = "#7CE7AC";

const TYPE_STYLE = {
  Bundling: { bg: "rgba(139, 92, 246, 0.1)", color: "#A78BFA", icon: <FaBoxOpen size={13} /> },
  Diskon: { bg: "rgba(94, 129, 244, 0.1)", color: PRIMARY, icon: <FaTag size={13} /> },
  Delivery: { bg: "rgba(124, 231, 172, 0.1)", color: SUCCESS, icon: <FaTruck size={13} /> },
  Flash: { bg: "rgba(244, 190, 94, 0.1)", color: "#F4BE5E", icon: <FaFire size={13} /> },
};

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

// Komponen Promo Card
function PromoCard({ promo, onToggle, onDelete }) {
  const ts = TYPE_STYLE[promo.type] || TYPE_STYLE.Diskon;
  const isExpired = new Date(promo.valid_until) < new Date();
  const daysLeft = Math.max(0, Math.round((new Date(promo.valid_until) - new Date()) / (1000 * 60 * 60 * 24)));

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
              <FaTrash />
            </button>
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>{promo.title}</div>
          <div style={{ fontSize: 12, color: "#8181A5" }}>{promo.description || ""}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F0F0F3", paddingTop: 12, marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#8181A5" }}>
            <FaCalendarAlt size={11} />
            <span>Berlaku hingga {promo.valid_until ? new Date(promo.valid_until).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {!isExpired && promo.active && (
              <span style={{ fontSize: 11, color: daysLeft <= 7 ? "#FF808B" : PRIMARY }}>
                {daysLeft} hari lagi
              </span>
            )}
            <span style={{ background: "rgba(94, 129, 244, 0.1)", color: PRIMARY, fontWeight: 800, fontSize: 14, padding: "4px 12px", borderRadius: 8 }}>
              {promo.discount || "-"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function Promos() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [form, setForm] = useState({ title: "", type: "Diskon", valid_until: "", description: "", discount: "" });

  // Load data dari Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await promosAPI.fetchAll();
        setPromos(data || []);
      } catch (err) {
        console.error("Error loading promos:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Toggle active
  const handleToggle = async (id) => {
    const promo = promos.find(p => p.id === id);
    if (!promo) return;
    try {
      await promosAPI.update(id, { active: !promo.active });
      setPromos(promos.map(p => p.id === id ? { ...p, active: !p.active } : p));
    } catch (err) {
      alert("❌ Gagal update promo: " + err.message);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus promo ini?")) return;
    try {
      await promosAPI.delete(id);
      setPromos(promos.filter(p => p.id !== id));
      alert("✅ Promo berhasil dihapus!");
    } catch (err) {
      alert("❌ Gagal hapus promo: " + err.message);
    }
  };

  // Create
  const handleSave = async () => {
    if (!form.title || !form.discount) {
      alert("⚠️ Judul dan diskon wajib diisi!");
      return;
    }
    try {
      const newPromo = {
        ...form,
        active: true,
        created_at: new Date().toISOString()
      };
      await promosAPI.create(newPromo);
      alert("✅ Promo berhasil dibuat!");
      setForm({ title: "", type: "Diskon", valid_until: "", description: "", discount: "" });
      setShowModal(false);
      const data = await promosAPI.fetchAll();
      setPromos(data);
    } catch (err) {
      alert("❌ Gagal buat promo: " + err.message);
    }
  };

  const filtered = promos.filter(p => filterType === "All" || p.type === filterType);
  const activeCount = promos.filter(p => p.active).length;

  const typeOptions = [
    { value: "All", label: "Semua" },
    { value: "Bundling", label: "Bundling" },
    { value: "Diskon", label: "Diskon" },
    { value: "Delivery", label: "Delivery" },
    { value: "Flash", label: "Flash" }
  ];

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }}>Memuat data promo...</div>;
  }

  return (
    <div style={{ background: "#F6F6F6", minHeight: "100vh", paddingBottom: 32 }}>
      <PageHeader title="Promo & Diskon" breadcrumb={["Dashboard", "Promos"]}>
        <Button type="primary" icon={FaPlus} onClick={() => setShowModal(true)}>
          Buat Promo
        </Button>
      </PageHeader>

      {/* Stats Summary */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <SummaryCard label="Total Promo" value={promos.length} color={PRIMARY} />
        <SummaryCard label="Promo Aktif" value={activeCount} color={SUCCESS} />
        <SummaryCard label="Promo Nonaktif" value={promos.length - activeCount} color="#AAABB0" />
      </div>

      {/* Filter */}
      <div style={{ marginBottom: 16 }}>
        <FilterTabs options={typeOptions} value={filterType} onChange={setFilterType} />
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
        {filtered.length === 0 ? (
          <Card padding="48px">
            <div style={{ textAlign: "center", color: "#AAABB0" }}>
              <FaTag size={32} style={{ display: "block", margin: "0 auto 12px", opacity: 0.3 }} />
              Tidak ada promo untuk kategori ini
            </div>
          </Card>
        ) : (
          filtered.map(p => (
            <PromoCard key={p.id} promo={p} onToggle={handleToggle} onDelete={handleDelete} />
          ))
        )}
      </div>

      {/* Modal Buat Promo */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Buat Promo Baru" width={440}>
        <div style={{ marginBottom: 13 }}>
          <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Judul Promo</label>
          <input
            type="text"
            placeholder="Contoh: Diskon 10% Weekend"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 13 }}>
          <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Nilai Diskon</label>
          <input
            type="text"
            placeholder="Contoh: 10% / Free Delivery"
            value={form.discount}
            onChange={(e) => setForm({ ...form, discount: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 13 }}>
          <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Deskripsi</label>
          <input
            type="text"
            placeholder="Syarat & ketentuan singkat"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 13 }}>
          <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Berlaku Hingga</label>
          <input
            type="date"
            value={form.valid_until}
            onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Tipe Promo</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Diskon", "Bundling", "Delivery", "Flash"].map(t => (
              <button
                key={t}
                onClick={() => setForm({ ...form, type: t })}
                style={{
                  padding: "7px 14px",
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: form.type === t ? `2px solid ${PRIMARY}` : "1px solid #ECECF2",
                  background: form.type === t ? "rgba(94, 129, 244, 0.1)" : "#FFF",
                  color: form.type === t ? PRIMARY : "#8181A5",
                }}
              >
                {t}
              </button>
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