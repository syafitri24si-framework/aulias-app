import { FaHome, FaShoppingCart, FaUsers, FaGem, FaTags, FaChartLine } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const GOLD = "#D4AF37";

export default function Sidebar() {
    return (
        <div style={{
            width: 260,
            background: "linear-gradient(180deg, #0A0C10 0%, #111318 100%)",
            padding: "24px 16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "100vh",
            borderRight: "1px solid rgba(212, 175, 55, 0.2)"
        }}>
            <div>
                {/* Logo */}
                // Di bagian logo sidebar
<div style={{
    width: 40, height: 40, borderRadius: 12,
    background: "linear-gradient(135deg, #D4AF37, #B8942E)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 20, flexShrink: 0
}}>
    <img 
    src={logoRotte} 
        alt="Rotte" 
        style={{ width: 28, height: 28, objectFit: "contain" }}
    />
</div>
                {/* Nav Label */}
                <div style={{ fontSize: 10, color: "rgba(212, 175, 55, 0.5)", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12, paddingLeft: 12 }}>
                    Navigasi
                </div>

                <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {[
                        { to: "/", icon: <FaHome size={14} />, label: "Dashboard" },
                        { to: "/orders", icon: <FaShoppingCart size={14} />, label: "Orders" },
                        { to: "/customers", icon: <FaUsers size={14} />, label: "Customers" },
                        { to: "/loyalty", icon: <FaGem size={14} />, label: "Loyalty" },
                        { to: "/promos", icon: <FaTags size={14} />, label: "Promos" },
                        { to: "/reports", icon: <FaChartLine size={14} />, label: "Reports" },
                    ].map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === "/"}
                            style={({ isActive }) => ({
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "12px 14px",
                                borderRadius: 12,
                                textDecoration: "none",
                                fontSize: 13,
                                fontWeight: 600,
                                color: isActive ? "#D4AF37" : "rgba(255,255,255,0.55)",
                                background: isActive ? "rgba(212, 175, 55, 0.1)" : "transparent",
                                borderLeft: isActive ? "3px solid #D4AF37" : "3px solid transparent",
                                transition: "all 0.15s"
                            })}
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div style={{ fontSize: 11, color: "rgba(212, 175, 55, 0.3)", paddingLeft: 12, fontWeight: 500 }}>
                © 2025 Rotte Bakery
            </div>
        </div>
    );
}