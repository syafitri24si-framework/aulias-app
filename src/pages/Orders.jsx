import { useState } from "react";
import { FaPlus, FaSearch, FaTimes, FaBoxOpen, FaCookie } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import ordersData from "../data/orders";

const PRIMARY = "#5E81F4";
const PRIMARY_DARK = "#1B51E5";
const SUCCESS = "#7CE7AC";
const WARNING = "#F4BE5E";
const ERROR = "#FF808B";

const STATUS_STYLE = {
    Completed: { bg: "rgba(124, 231, 172, 0.15)", color: SUCCESS, dot: SUCCESS },
    Pending:   { bg: "rgba(244, 190, 94, 0.15)", color: WARNING, dot: WARNING },
    Cancelled: { bg: "rgba(255, 128, 139, 0.15)", color: ERROR, dot: ERROR },
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
        <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "16px 20px", border: "1px solid #F0F0F3", flex: 1, borderTop: `3px solid ${color}` }}>
            <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: 12, color: "#8181A5", marginTop: 3 }}>{label}</div>
        </div>
    );
}

function inputStyle() {
    return {
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
        <div style={{ background: "#F6F6F6", minHeight: "100vh", paddingBottom: 32 }}>
            <PageHeader title="Orders" breadcrumb={["Dashboard", "Orders"]}>
                <button
                    onClick={() => setShowModal(true)}
                    style={{ display: "flex", alignItems: "center", gap: 8, background: PRIMARY, color: "#FFF", border: "none", borderRadius: 12, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = PRIMARY_DARK}
                    onMouseLeave={e => e.currentTarget.style.background = PRIMARY}
                >
                    <FaPlus size={11} /> Tambah Order
                </button>
            </PageHeader>

            {/* Summary Cards */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <SummaryCard label="Total Revenue" value={`Rp ${(totalRevenue / 1000000).toFixed(1)}jt`} color={PRIMARY} />
                <SummaryCard label="Completed" value={completed} color={SUCCESS} />
                <SummaryCard label="Pending" value={pending} color={WARNING} />
                <SummaryCard label="Cancelled" value={cancelled} color={ERROR} />
            </div>

            {/* Filter Bar */}
            <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "14px 18px", border: "1px solid #F0F0F3", marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                        <FaSearch style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#AAABB0", fontSize: 12 }} />
                        <input
                            placeholder="Cari nama / ID order..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ ...inputStyle(), paddingLeft: 32 }}
                        />
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                        {["All", "Completed", "Pending", "Cancelled"].map(s => (
                            <button key={s} onClick={() => setStatusFilter(s)}
                                style={{
                                    padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                                    background: statusFilter === s ? PRIMARY : "#F5F5FA",
                                    color: statusFilter === s ? "#FFF" : "#8181A5",
                                    transition: "all 0.15s",
                                }}
                            >{s}</button>
                        ))}
                    </div>
                    <select value={sortField} onChange={e => setSortField(e.target.value)}
                        style={{ padding: "8px 12px", border: "1px solid #ECECF2", borderRadius: 10, fontSize: 13, color: "#464A5F", outline: "none", background: "#FFFFFF" }}>
                        <option value="orderDate">Terbaru</option>
                        <option value="totalPrice">Harga Tertinggi</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div style={{ background: "#FFFFFF", borderRadius: 14, border: "1px solid #F0F0F3", overflow: "hidden" }}>
                <div style={{ padding: "13px 18px", borderBottom: "1px solid #F0F0F3" }}>
                    <span style={{ fontSize: 13, color: "#8181A5" }}>Menampilkan <strong style={{ color: PRIMARY }}>{filtered.length}</strong> order</span>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table className="figma-table">
                        <thead>
                            <tr>
                                <th>Order ID</th><th>Customer</th><th>Items</th><th>Status</th><th>Total</th><th>Tanggal</th><th>Pembayaran</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(o => (
                                <tr key={o.id}>
                                    <td><span style={{ fontFamily: "monospace", background: "rgba(94, 129, 244, 0.1)", color: PRIMARY, padding: "3px 8px", borderRadius: 6, fontSize: 12 }}>#{o.id}</span></td>
                                    <td style={{ fontWeight: 600, color: "#1A1A1A" }}>{o.customerName}</td>
                                    <td>
                                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                            {o.items?.map((item, idx) => (
                                                <span key={idx} style={{ display: "flex", alignItems: "center", gap: 3, background: "rgba(94, 129, 244, 0.1)", padding: "2px 8px", borderRadius: 12, fontSize: 10, color: PRIMARY }}>
                                                    <FaCookie size={8} /> {item}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td><StatusBadge status={o.status} /></td>
                                    <td style={{ fontWeight: 700, color: PRIMARY }}>Rp {o.totalPrice.toLocaleString()}</td>
                                    <td style={{ color: "#8181A5" }}>{o.orderDate}</td>
                                    <td><span style={{ background: "#F5F5FA", color: "#8181A5", padding: "3px 10px", borderRadius: 6, fontSize: 12 }}>{o.paymentMethod}</span></td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#AAABB0" }}>
                                        <FaBoxOpen size={32} style={{ display: "block", margin: "0 auto 12px", opacity: 0.3 }} />
                                        Tidak ada order
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Tambah Order */}
            {showModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}
                    onClick={() => setShowModal(false)}>
                    <div style={{ background: "#FFFFFF", borderRadius: 20, padding: 28, width: 420, border: "1px solid #F0F0F3" }}
                        onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1A1A1A" }}>Tambah Order</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#AAABB0" }}><FaTimes size={16} /></button>
                        </div>
                        {[
                            { label: "Nama Customer", key: "customerName", type: "text", placeholder: "Nama pelanggan" },
                            { label: "Items (pisahkan dengan koma)", key: "items", type: "text", placeholder: "Roti Coklat, Donat, Croissant" },
                            { label: "Total Harga (Rp)", key: "totalPrice", type: "number", placeholder: "50000" },
                            { label: "Tanggal Order", key: "orderDate", type: "date", placeholder: "" },
                        ].map(f => (
                            <div key={f.key} style={{ marginBottom: 14 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#464A5F", display: "block", marginBottom: 5 }}>{f.label}</label>
                                <input type={f.type} placeholder={f.placeholder}
                                    value={form[f.key]}
                                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                    style={inputStyle()}
                                />
                            </div>
                        ))}
                        <div style={{ marginBottom: 14 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#464A5F", display: "block", marginBottom: 5 }}>Status</label>
                            <div style={{ display: "flex", gap: 8 }}>
                                {["Pending", "Completed", "Cancelled"].map(s => (
                                    <button key={s} onClick={() => setForm({ ...form, status: s })}
                                        style={{
                                            flex: 1, padding: 8, borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer",
                                            border: form.status === s ? `2px solid ${PRIMARY}` : "1px solid #ECECF2",
                                            background: form.status === s ? "rgba(94, 129, 244, 0.1)" : "#FFF",
                                            color: form.status === s ? PRIMARY : "#8181A5",
                                        }}
                                    >{s}</button>
                                ))}
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#464A5F", display: "block", marginBottom: 5 }}>Metode Pembayaran</label>
                            <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
                                style={inputStyle()}>
                                <option>Cash</option><option>Transfer</option><option>QRIS</option><option>Kartu Kredit</option>
                            </select>
                        </div>
                        <button onClick={() => setShowModal(false)}
                            style={{ width: "100%", background: PRIMARY, color: "#FFF", border: "none", borderRadius: 12, padding: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                            onMouseEnter={e => e.currentTarget.style.background = PRIMARY_DARK}
                            onMouseLeave={e => e.currentTarget.style.background = PRIMARY}
                        >Simpan Order</button>
                    </div>
                </div>
            )}
        </div>
    );
}