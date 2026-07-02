import { FaHome, FaShoppingCart, FaUsers, FaGem, FaTags, FaChartLine, FaUserCog } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import logoRotte from "../assets/logo-rotte.png"; // Sesuaikan path logo Anda

const GOLD = "#D4AF37";

export default function Sidebar() {
    // Ambil data user dari localStorage untuk cek role
    const userData = localStorage.getItem("user");
    let userRole = "staff";
    if (userData) {
        try {
            const user = JSON.parse(userData);
            userRole = user.role || "staff";
        } catch (e) {
            console.error("Error parsing user data:", e);
        }
    }

    // Cek apakah user adalah admin
    const isAdmin = userRole === "admin";

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
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 32
                }}>
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
                    <span style={{
                        color: "#D4AF37",
                        fontSize: 18,
                        fontWeight: 800,
                        fontFamily: "'Lato', sans-serif"
                    }}>
                        Rotte CRM
                    </span>
                </div>

                {/* Nav Label */}
                <div style={{ 
                    fontSize: 10, 
                    color: "rgba(212, 175, 55, 0.5)", 
                    fontWeight: 700, 
                    letterSpacing: 1.5, 
                    textTransform: "uppercase", 
                    marginBottom: 12, 
                    paddingLeft: 12,
                    fontFamily: "'Lato', sans-serif"
                }}>
                    Navigasi
                </div>

                <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {[
                        { to: "/dashboard", icon: <FaHome size={14} />, label: "Dashboard" },
                        { to: "/orders", icon: <FaShoppingCart size={14} />, label: "Orders" },
                        { to: "/customers", icon: <FaUsers size={14} />, label: "Customers" },
                        { to: "/loyalty", icon: <FaGem size={14} />, label: "Loyalty" },
                        { to: "/promos", icon: <FaTags size={14} />, label: "Promos" },
                        { to: "/reports", icon: <FaChartLine size={14} />, label: "Reports" },
                        // [TAMBAHKAN] Menu Users - muncul untuk SEMUA user
                        { to: "/users", icon: <FaUserCog size={14} />, label: "Users" },
                    ].map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === "/dashboard"}
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
                                transition: "all 0.15s",
                                fontFamily: "'Lato', sans-serif"
                            })}
                            onMouseEnter={(e) => {
                                if (!e.currentTarget.style.isActive) {
                                    e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!e.currentTarget.style.isActive) {
                                    e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                                }
                            }}
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Info User di sidebar */}
                {userData && (
                    <div style={{
                        marginTop: 24,
                        padding: "12px 14px",
                        borderTop: "1px solid rgba(212, 175, 55, 0.1)",
                        borderRadius: 12,
                    }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10
                        }}>
                            <div style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #D4AF37, #B8942E)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#0A0C10",
                                fontWeight: 700,
                                fontSize: 14,
                                fontFamily: "'Lato', sans-serif"
                            }}>
                                {(() => {
                                    try {
                                        const user = JSON.parse(userData);
                                        return user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();
                                    } catch {
                                        return "U";
                                    }
                                })()}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    color: "white",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    fontFamily: "'Lato', sans-serif"
                                }}>
                                    {(() => {
                                        try {
                                            const user = JSON.parse(userData);
                                            return user.full_name || user.email;
                                        } catch {
                                            return "User";
                                        }
                                    })()}
                                </div>
                                <div style={{
                                    color: "rgba(212, 175, 55, 0.6)",
                                    fontSize: 11,
                                    fontFamily: "'Lato', sans-serif"
                                }}>
                                    {(() => {
                                        try {
                                            const user = JSON.parse(userData);
                                            return user.role || "staff";
                                        } catch {
                                            return "staff";
                                        }
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ 
                fontSize: 11, 
                color: "rgba(212, 175, 55, 0.3)", 
                paddingLeft: 12, 
                fontWeight: 500,
                fontFamily: "'Lato', sans-serif"
            }}>
                © 2025 Rotte Bakery
            </div>
        </div>
    );
}