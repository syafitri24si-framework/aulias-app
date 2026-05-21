// [COM] CustomerDetail page - menggunakan Container component
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaEnvelope, FaPhone, FaCalendarAlt } from "react-icons/fa";
import customersData from "../data/customers";
import ordersData from "../data/orders";
import Avatar from "../components/Avatar";
import TierBadge from "../components/TierBadge";
import StatusBadge from "../components/StatusBadge";
import Card from "../components/Card";
import Container from "../components/Container";  // [COM] Import Container
import LoadingSpinner from "../components/LoadingSpinner";

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
        const found = customersData.find(c => c.id === parseInt(id));
        
        if (found) {
            setCustomer(found);
            const orders = ordersData.filter(o => o.customerId === found.id);
            setCustomerOrders(orders);
        }
        setLoading(false);
    }, [id]);

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    if (!customer) {
        return (
            <Container>
                <div style={{ textAlign: "center", padding: 48 }}>
                    <h2 style={{ color: "#AAABB0" }}>Customer tidak ditemukan</h2>
                    <Link to="/customers" style={{ color: PRIMARY, textDecoration: "none", marginTop: 16, display: "inline-block" }}>
                        ← Kembali ke daftar customer
                    </Link>
                </div>
            </Container>
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

            {/* [COM] Container membungkus konten utama */}
            <Container maxWidth="1000px" padding="0 24px">
                {/* Profile Card */}
                <Card padding="28px 32px">
                    <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
                        <Avatar name={customer.name} size="xl" />
                        <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                                <h1 style={{ margin: 0, fontSize: 28, color: "#1A1A1A" }}>{customer.name}</h1>
                                <TierBadge tier={customer.loyalty} />
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
                </Card>

                {/* Stats Row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 20 }}>
                    <Card padding="18px 20px">
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 32, fontWeight: 800, color: PRIMARY }}>{totalOrders}</div>
                            <div style={{ fontSize: 13, color: "#8181A5" }}>Total Order</div>
                        </div>
                    </Card>
                    <Card padding="18px 20px">
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 32, fontWeight: 800, color: PRIMARY }}>Rp {totalSpent.toLocaleString()}</div>
                            <div style={{ fontSize: 13, color: "#8181A5" }}>Total Belanja</div>
                        </div>
                    </Card>
                    <Card padding="18px 20px">
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 32, fontWeight: 800, color: PRIMARY }}>{customer.points || 0}</div>
                            <div style={{ fontSize: 13, color: "#8181A5" }}>Poin Loyalty</div>
                        </div>
                    </Card>
                    <Card padding="18px 20px">
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 32, fontWeight: 800, color: completedOrders === totalOrders ? "#7CE7AC" : PRIMARY }}>{completedOrders}/{totalOrders}</div>
                            <div style={{ fontSize: 13, color: "#8181A5" }}>Order Selesai</div>
                        </div>
                    </Card>
                </div>

                {/* Order History */}
                <Card padding="0">
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
                                    {customerOrders.map(order => (
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
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td style={{ padding: "14px 16px", fontWeight: 700, color: PRIMARY }}>Rp {order.totalPrice.toLocaleString()}</td>
                                            <td style={{ padding: "14px 16px", color: "#8181A5" }}>{order.orderDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </Container>
        </div>
    );
}