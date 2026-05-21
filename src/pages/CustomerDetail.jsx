import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaTrophy, FaCoins, FaCalendarAlt } from "react-icons/fa";
import customersData from "../data/customers";
import ordersData from "../data/orders";

const PRIMARY = "#5E81F4";
const TIER_STYLE = {
    Gold: { bg: "rgba(94, 129, 244, 0.1)", color: PRIMARY, label: "Gold Member ✨" },
    Silver: { bg: "rgba(129, 129, 165, 0.1)", color: "#8181A5", label: "Silver Member 🥈" },
    Bronze: { bg: "rgba(244, 190, 94, 0.1)", color: "#F4BE5E", label: "Bronze Member 🥉" },
    None: { bg: "rgba(170, 171, 176, 0.1)", color: "#AAABB0", label: "Non Member" }
};

export default function CustomerDetail() {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [customerOrders, setCustomerOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cari customer berdasarkan id (id di sini adalah angka, misal 1, 2, 3...)
        const found = customersData.find(c => c.id === parseInt(id));
        
        if (found) {
            setCustomer(found);
            // Ambil semua order customer ini
            const orders = ordersData.filter(o => o.customerId === found.id);
            setCustomerOrders(orders);
        }
        setLoading(false);
    }, [id]);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <div style={{ width: 40, height: 40, border: `4px solid ${PRIMARY}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!customer) {
        return (
            <div style={{ textAlign: "center", padding: 48 }}>
                <h2 style={{ color: "#AAABB0" }}>Customer tidak ditemukan</h2>
                <Link to="/customers" style={{ color: PRIMARY, textDecoration: "none", marginTop: 16, display: "inline-block" }}>
                    ← Kembali ke daftar customer
                </Link>
            </div>
        );
    }

    const totalSpent = customerOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const tierInfo = TIER_STYLE[customer.loyalty] || TIER_STYLE.None;
    const totalOrders = customerOrders.length;
    const completedOrders = customerOrders.filter(o => o.status === "Completed").length;

    return (
        <div style={{ background: "#F6F6F6", minHeight: "100vh", paddingBottom: 32 }}>
            {/* Header with back button */}
            <div style={{ padding: "20px 24px 0 24px" }}>
                <Link to="/customers" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: PRIMARY, textDecoration: "none", fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
                    <FaArrowLeft size={12} /> Kembali ke Customers
                </Link>
            </div>

            <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
                {/* Profile Card */}
                <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "28px 32px", border: "1px solid #F0F0F3", marginBottom: 20 }}>
                    <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
                        {/* Avatar besar */}
                        <div style={{
                            width: 100, height: 100, borderRadius: "50%",
                            background: tierInfo.bg, color: tierInfo.color,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 36, fontWeight: 700
                        }}>
                            {customer.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                        </div>

                        {/* Info utama */}
                        <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                                <h1 style={{ margin: 0, fontSize: 28, color: "#1A1A1A" }}>{customer.name}</h1>
                                <span style={{ background: tierInfo.bg, color: tierInfo.color, padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                                    {tierInfo.label}
                                </span>
                            </div>
                            <p style={{ color: "#8181A5", marginBottom: 16 }}>ID Customer: #{customer.id}</p>
                            
                            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#464A5F", fontSize: 13 }}>
                                    <FaEnvelope style={{ color: PRIMARY }} /> {customer.email}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#464A5F", fontSize: 13 }}>
                                    <FaPhone style={{ color: PRIMARY }} /> {customer.phone}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#464A5F", fontSize: 13 }}>
                                    <FaCalendarAlt style={{ color: PRIMARY }} /> Bergabung: {customer.joinDate}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 20 }}>
                    <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "18px 20px", border: "1px solid #F0F0F3", textAlign: "center" }}>
                        <div style={{ fontSize: 32, fontWeight: 800, color: PRIMARY }}>{totalOrders}</div>
                        <div style={{ fontSize: 13, color: "#8181A5" }}>Total Order</div>
                    </div>
                    <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "18px 20px", border: "1px solid #F0F0F3", textAlign: "center" }}>
                        <div style={{ fontSize: 32, fontWeight: 800, color: PRIMARY }}>Rp {totalSpent.toLocaleString()}</div>
                        <div style={{ fontSize: 13, color: "#8181A5" }}>Total Belanja</div>
                    </div>
                    <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "18px 20px", border: "1px solid #F0F0F3", textAlign: "center" }}>
                        <div style={{ fontSize: 32, fontWeight: 800, color: PRIMARY }}>{customer.points || 0}</div>
                        <div style={{ fontSize: 13, color: "#8181A5" }}>Poin Loyalty</div>
                    </div>
                    <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "18px 20px", border: "1px solid #F0F0F3", textAlign: "center" }}>
                        <div style={{ fontSize: 32, fontWeight: 800, color: completedOrders === totalOrders ? "#7CE7AC" : PRIMARY }}>{completedOrders}/{totalOrders}</div>
                        <div style={{ fontSize: 13, color: "#8181A5" }}>Order Selesai</div>
                    </div>
                </div>

                {/* Order History */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #F0F0F3", overflow: "hidden" }}>
                    <div style={{ padding: "18px 24px", borderBottom: "1px solid #F0F0F3", fontWeight: 700, color: "#1A1A1A" }}>
                        🛒 Riwayat Order
                    </div>
                    {customerOrders.length === 0 ? (
                        <div style={{ padding: 48, textAlign: "center", color: "#AAABB0" }}>
                            Belum ada order dari customer ini
                        </div>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "#F9F9FB", borderBottom: "1px solid #F0F0F3" }}>
                                        <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, color: "#8181A5" }}>ID Order</th>
                                        <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, color: "#8181A5" }}>Items</th>
                                        <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, color: "#8181A5" }}>Status</th>
                                        <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, color: "#8181A5" }}>Total</th>
                                        <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, color: "#8181A5" }}>Tanggal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customerOrders.map(order => {
                                        const statusStyle = {
                                            Completed: { bg: "rgba(124, 231, 172, 0.15)", color: "#7CE7AC" },
                                            Pending: { bg: "rgba(244, 190, 94, 0.15)", color: "#F4BE5E" },
                                            Cancelled: { bg: "rgba(255, 128, 139, 0.15)", color: "#FF808B" }
                                        };
                                        const s = statusStyle[order.status];
                                        return (
                                            <tr key={order.id} style={{ borderBottom: "1px solid #F0F0F3" }}>
                                                <td style={{ padding: "14px 16px", fontFamily: "monospace", color: PRIMARY }}>{order.id}</td>
                                                <td style={{ padding: "14px 16px" }}>
                                                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                                        {order.items?.map((item, idx) => (
                                                            <span key={idx} style={{ background: "rgba(94, 129, 244, 0.1)", color: PRIMARY, padding: "2px 10px", borderRadius: 12, fontSize: 11 }}>
                                                                {item}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td style={{ padding: "14px 16px" }}>
                                                    <span style={{ background: s?.bg, color: s?.color, padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "14px 16px", fontWeight: 700, color: PRIMARY }}>Rp {order.totalPrice.toLocaleString()}</td>
                                                <td style={{ padding: "14px 16px", color: "#8181A5" }}>{order.orderDate}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}