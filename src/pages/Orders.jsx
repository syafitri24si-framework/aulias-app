import { useState } from "react";
import { FaPlus, FaSearch, FaTimes, FaBoxOpen, FaCookie } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import ordersData from "../data/orders";

const GOLD = "#D4AF37";

const STATUS_STYLE = {
    Completed: { bg: "rgba(74, 222, 128, 0.15)", color: "#4ADE80", dot: "#4ADE80" },
    Pending:   { bg: "rgba(251, 191, 36, 0.15)", color: "#FBBF24", dot: "#FBBF24" },
    Cancelled: { bg: "rgba(248, 113, 113, 0.15)", color: "#F87171", dot: "#F87171" },
};

function StatusBadge({ status }) {
    const s = STATUS_STYLE[status] || {};
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: s.bg, color: s.color, padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
            {status}
        </span>
    );
}

function SummaryCard({ label, value, color }) {
    return (
        <div style={{ background: "rgba(21, 23, 29, 0.8)", backdropFilter: "blur(12px)", borderRadius: 14, padding: "16px 20px", border: "1px solid rgba(212, 175, 55, 0.2)", flex: 1, borderTop: `3px solid ${color}` }}>
            <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 3 }}>{label}</div>
        </div>
    );
}

export default function Orders() {
    const [showModal, setShowModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("orderDate");
    const [form, setForm] = useState({ customerName: "", status: "Pending", totalPrice: "", orderDate: "", paymentMethod: "Cash", items: "" });

    const filtered = ordersData
        .filter(o =>
            (statusFilter === "All" || o.status === statusFilter) &&
            (o.customerName.toLowerCase().includes(search.toLowerCase()) || String(o.id).includes(search))
        )
        .sort((a, b) => {
            if (sortField === "totalPrice") return b.totalPrice - a.totalPrice;
            if (sortField === "orderDate") return new Date(b.orderDate) - new Date(a.orderDate);
            return 0;
        });

    const totalRevenue = ordersData.reduce((s, o) => s + o.totalPrice, 0);
    const completed = ordersData.filter(o => o.status === "Completed").length;
    const pending = ordersData.filter(o => o.status === "Pending").length;
    const cancelled = ordersData.filter(o => o.status === "Cancelled").length;

    return (
        <div style={{ background: "#0A0C10", minHeight: "100vh", paddingBottom: 32 }}>
            <PageHeader title="Orders" breadcrumb={["Dashboard", "Orders"]}>
                <button
                    onClick={() => setShowModal(true)}
                    style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #D4AF37, #B8942E)", color: "#000", border: "none", borderRadius: 12, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                    <FaPlus size={11} /> Tambah Order
                </button>
            </PageHeader>

            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <SummaryCard label="Total Revenue" value={`Rp ${(totalRevenue / 1000000).toFixed(1)}jt`} color="#D4AF37" />
                <SummaryCard label="Completed" value={completed} color="#4ADE80" />
                <SummaryCard label="Pending" value={pending} color="#FBBF24" />
                <SummaryCard label="Cancelled" value={cancelled} color="#F87171" />
            </div>

            <div style={{ background: "rgba(21, 23, 29, 0.8)", backdropFilter: "blur(12px)", borderRadius: 14, padding: "14px 18px", border: "1px solid rgba(212, 175, 55, 0.2)", marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                        <FaSearch style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: 12 }} />
                        <input
                            placeholder="Cari nama / ID order..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ width: "100%", paddingLeft: 32, paddingRight: 10, paddingTop: 9, paddingBottom: 9, border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", color: "#F3F4F6", background: "rgba(0,0,0,0.3)" }}
                        />
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                        {["All", "Completed", "Pending", "Cancelled"].map(s => (
                            <button key={s} onClick={() => setStatusFilter(s)}
                                style={{
                                    padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                                    background: statusFilter === s ? "#D4AF37" : "rgba(255,255,255,0.05)",
                                    color: statusFilter === s ? "#000" : "#9CA3AF",
                                    transition: "all 0.15s",
                                }}
                            >{s}</button>
                        ))}
                    </div>
                    <select value={sortField} onChange={e => setSortField(e.target.value)}
                        style={{ padding: "8px 12px", border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 10, fontSize: 13, color: "#F3F4F6", outline: "none", background: "rgba(0,0,0,0.3)" }}>
                        <option value="orderDate">Terbaru</option>
                        <option value="totalPrice">Harga Tertinggi</option>
                    </select>
                </div>
            </div>

            <div style={{ background: "rgba(21, 23, 29, 0.8)", backdropFilter: "blur(12px)", borderRadius: 14, border: "1px solid rgba(212, 175, 55, 0.2)", overflow: "hidden" }}>
                <div style={{ padding: "13px 18px", borderBottom: "1px solid rgba(212, 175, 55, 0.15)" }}>
                    <span style={{ fontSize: 13, color: "#9CA3AF" }}>Menampilkan <strong style={{ color: "#D4AF37" }}>{filtered.length}</strong> order</span>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: "rgba(0,0,0,0.2)" }}>
                                {["Order ID", "Customer", "Items", "Status", "Total", "Tanggal", "Pembayaran"].map(h => (
                                    <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: "#D4AF37", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(212, 175, 55, 0.15)" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(o => (
                                <tr key={o.id}
                                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.1s" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(212, 175, 55, 0.05)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    <td style={{ padding: "12px 16px" }}>
                                        <span style={{ fontFamily: "monospace", background: "rgba(212, 175, 55, 0.15)", color: "#D4AF37", padding: "3px 8px", borderRadius: 6, fontSize: 12 }}>#{o.id}</span>
                                    </td>
                                    <td style={{ padding: "12px 16px", fontWeight: 600, color: "#F3F4F6" }}>{o.customerName}</td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                            {o.items.map((item, idx) => (
                                                <span key={idx} style={{ display: "flex", alignItems: "center", gap: 3, background: "rgba(212, 175, 55, 0.1)", padding: "2px 8px", borderRadius: 12, fontSize: 10, color: "#D4AF37" }}>
                                                    <FaCookie size={8} /> {item}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={{ padding: "12px 16px" }}><StatusBadge status={o.status} /></td>
                                    <td style={{ padding: "12px 16px", fontWeight: 700, color: "#D4AF37" }}>Rp {o.totalPrice.toLocaleString()}</td>
                                    <td style={{ padding: "12px 16px", color: "#9CA3AF" }}>{o.orderDate}</td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <span style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF", padding: "3px 10px", borderRadius: 6, fontSize: 12 }}>{o.paymentMethod}</span>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#6B7280" }}>
                                        <FaBoxOpen size={32} style={{ display: "block", margin: "0 auto 12px", opacity: 0.3 }} />
                                        Tidak ada order
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}
                    onClick={() => setShowModal(false)}>
                    <div style={{ background: "#15171D", borderRadius: 20, padding: 28, width: 420, border: "1px solid rgba(212, 175, 55, 0.3)" }}
                        onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#F3F4F6" }}>Tambah Order</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><FaTimes size={16} /></button>
                        </div>
                        {[
                            { label: "Nama Customer", key: "customerName", type: "text", placeholder: "Nama pelanggan" },
                            { label: "Items (pisahkan dengan koma)", key: "items", type: "text", placeholder: "Roti Coklat, Donat, Croissant" },
                            { label: "Total Harga (Rp)", key: "totalPrice", type: "number", placeholder: "50000" },
                            { label: "Tanggal Order", key: "orderDate", type: "date", placeholder: "" },
                        ].map(f => (
                            <div key={f.key} style={{ marginBottom: 14 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#D4AF37", display: "block", marginBottom: 5 }}>{f.label}</label>
                                <input type={f.type} placeholder={f.placeholder}
                                    value={form[f.key]}
                                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                    style={{ width: "100%", padding: "10px 12px", border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", background: "rgba(0,0,0,0.3)", color: "#F3F4F6" }} />
                            </div>
                        ))}
                        <div style={{ marginBottom: 14 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#D4AF37", display: "block", marginBottom: 5 }}>Status</label>
                            <div style={{ display: "flex", gap: 8 }}>
                                {["Pending", "Completed", "Cancelled"].map(s => (
                                    <button key={s} onClick={() => setForm({ ...form, status: s })}
                                        style={{
                                            flex: 1, padding: 8, borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer",
                                            border: form.status === s ? `2px solid ${GOLD}` : "1px solid rgba(212, 175, 55, 0.3)",
                                            background: form.status === s ? "rgba(212, 175, 55, 0.15)" : "rgba(0,0,0,0.3)",
                                            color: form.status === s ? GOLD : "#9CA3AF",
                                        }}
                                    >{s}</button>
                                ))}
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#D4AF37", display: "block", marginBottom: 5 }}>Metode Pembayaran</label>
                            <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
                                style={{ width: "100%", padding: "10px 12px", border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 10, fontSize: 13, outline: "none", background: "rgba(0,0,0,0.3)", color: "#F3F4F6" }}>
                                <option>Cash</option>
                                <option>Transfer</option>
                                <option>QRIS</option>
                                <option>Kartu Kredit</option>
                            </select>
                        </div>
                        <button onClick={() => setShowModal(false)}
                            style={{ width: "100%", background: "linear-gradient(135deg, #D4AF37, #B8942E)", color: "#000", border: "none", borderRadius: 12, padding: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                        >Simpan Order</button>
                    </div>
                </div>
            )}
        </div>
    );
}