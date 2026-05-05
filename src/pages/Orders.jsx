import { useState } from "react";
import { FaPlus, FaSearch, FaTimes, FaBoxOpen, FaChevronDown } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import ordersData from "../data/orders";


const MAROON = "#7B1C1C";
const MAROON_DARK = "#5A1313";
const MAROON_MUTED = "#F9EFEF";


const STATUS_STYLE = {
    Completed: { bg: "#DCFCE7", color: "#15803D", dot: "#16A34A" },
    Pending:   { bg: "#FEF9C3", color: "#A16207", dot: "#CA8A04" },
    Cancelled: { bg: "#FEE2E2", color: "#B91C1C", dot: "#DC2626" },
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
        <div style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", border: "1px solid #EEE", flex: 1, borderTop: `3px solid ${color}` }}>
            <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>{label}</div>
        </div>
    );
}


export default function Orders() {
    const [showModal, setShowModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("orderDate");
    const [form, setForm] = useState({ customerName: "", status: "Pending", totalPrice: "", orderDate: "", paymentMethod: "Cash" });


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
        <div style={{ background: "#F7F7F7", minHeight: "100vh", paddingBottom: 32 }}>
            <PageHeader title="Orders" breadcrumb={["Dashboard", "Orders"]}>
                <button
                    onClick={() => setShowModal(true)}
                    style={{ display: "flex", alignItems: "center", gap: 8, background: MAROON, color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = MAROON_DARK}
                    onMouseLeave={e => e.currentTarget.style.background = MAROON}
                >
                    <FaPlus size={11} /> Tambah Order
                </button>
            </PageHeader>


            {/* Summary Cards */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <SummaryCard label="Total Revenue" value={`Rp ${(totalRevenue / 1000000).toFixed(1)}jt`} color={MAROON} />
                <SummaryCard label="Completed" value={completed} color="#16A34A" />
                <SummaryCard label="Pending" value={pending} color="#CA8A04" />
                <SummaryCard label="Cancelled" value={cancelled} color="#DC2626" />
            </div>


            {/* Filter Bar */}
            <div style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", border: "1px solid #EEE", marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                        <FaSearch style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#CCC", fontSize: 12 }} />
                        <input
                            placeholder="Cari nama / ID order..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ width: "100%", paddingLeft: 32, paddingRight: 10, paddingTop: 8, paddingBottom: 8, border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box", color: "#333" }}
                        />
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                        {["All", "Completed", "Pending", "Cancelled"].map(s => (
                            <button key={s} onClick={() => setStatusFilter(s)}
                                style={{
                                    padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                                    background: statusFilter === s ? MAROON : "#F5F5F5",
                                    color: statusFilter === s ? "#fff" : "#666",
                                    transition: "all 0.15s",
                                }}
                            >{s}</button>
                        ))}
                    </div>
                    <select value={sortField} onChange={e => setSortField(e.target.value)}
                        style={{ padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, color: "#555", outline: "none" }}>
                        <option value="orderDate">Terbaru</option>
                        <option value="totalPrice">Harga Tertinggi</option>
                    </select>
                </div>
            </div>


            {/* Table */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #EEE", overflow: "hidden" }}>
                <div style={{ padding: "13px 18px", borderBottom: "1px solid #F0F0F0" }}>
                    <span style={{ fontSize: 13, color: "#888" }}>Menampilkan <strong style={{ color: "#333" }}>{filtered.length}</strong> order</span>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: "#FAFAFA" }}>
                                {["Order ID", "Customer", "Status", "Total", "Tanggal", "Pembayaran"].map(h => (
                                    <th key={h} style={{ textAlign: "left", padding: "11px 16px", color: "#999", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #F0F0F0" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(o => (
                                <tr key={o.id}
                                    style={{ borderBottom: "1px solid #F9F9F9", transition: "background 0.1s" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    <td style={{ padding: "12px 16px" }}>
                                        <span style={{ fontFamily: "monospace", background: "#F5F5F5", color: "#666", padding: "3px 8px", borderRadius: 5, fontSize: 12 }}>#{o.id}</span>
                                    </td>
                                    <td style={{ padding: "12px 16px", fontWeight: 600, color: "#222" }}>{o.customerName}</td>
                                    <td style={{ padding: "12px 16px" }}><StatusBadge status={o.status} /></td>
                                    <td style={{ padding: "12px 16px", fontWeight: 700, color: MAROON }}>Rp {o.totalPrice.toLocaleString()}</td>
                                    <td style={{ padding: "12px 16px", color: "#777" }}>{o.orderDate}</td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <span style={{ background: "#F5F5F5", color: "#555", padding: "3px 10px", borderRadius: 5, fontSize: 12 }}>{o.paymentMethod}</span>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#CCC" }}>
                                    <FaBoxOpen size={32} style={{ display: "block", margin: "0 auto 12px", opacity: 0.3 }} />
                                    Tidak ada order
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* Modal Add Order */}
            {showModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}
                    onClick={() => setShowModal(false)}>
                    <div style={{ background: "#fff", borderRadius: 20, padding: 28, width: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
                        onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Tambah Order</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#AAA" }}><FaTimes size={16} /></button>
                        </div>
                        {[
                            { label: "Nama Customer", key: "customerName", type: "text", placeholder: "Nama pelanggan" },
                            { label: "Total Harga (Rp)", key: "totalPrice", type: "number", placeholder: "50000" },
                            { label: "Tanggal Order", key: "orderDate", type: "date", placeholder: "" },
                        ].map(f => (
                            <div key={f.key} style={{ marginBottom: 14 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>{f.label}</label>
                                <input type={f.type} placeholder={f.placeholder}
                                    value={form[f.key]}
                                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                            </div>
                        ))}
                        <div style={{ marginBottom: 14 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>Status</label>
                            <div style={{ display: "flex", gap: 8 }}>
                                {["Pending", "Completed", "Cancelled"].map(s => (
                                    <button key={s} onClick={() => setForm({ ...form, status: s })}
                                        style={{
                                            flex: 1, padding: 8, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                                            border: form.status === s ? `2px solid ${MAROON}` : "1px solid #E5E7EB",
                                            background: form.status === s ? MAROON_MUTED : "#fff",
                                            color: form.status === s ? MAROON : "#666",
                                        }}
                                    >{s}</button>
                                ))}
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>Metode Pembayaran</label>
                            <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
                                style={{ width: "100%", padding: "9px 12px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, outline: "none" }}>
                                <option>Cash</option>
                                <option>Transfer</option>
                                <option>QRIS</option>
                                <option>Kartu Kredit</option>
                            </select>
                        </div>
                        <button onClick={() => setShowModal(false)}
                            style={{ width: "100%", background: MAROON, color: "#fff", border: "none", borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                            onMouseEnter={e => e.currentTarget.style.background = MAROON_DARK}
                            onMouseLeave={e => e.currentTarget.style.background = MAROON}
                        >Simpan Order</button>
                    </div>
                </div>
            )}
        </div>
    );
}

