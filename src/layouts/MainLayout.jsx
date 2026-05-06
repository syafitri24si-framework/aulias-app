import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    FaTachometerAlt, FaUsers, FaShoppingCart, FaStar, FaTag,
    FaChartBar, FaSignOutAlt, FaBars, FaTimes, FaBell, FaUser
} from "react-icons/fa";
import logoRotte from "../assets/logo_rotte.png";

const GOLD = "#D4AF37";
const GOLD_DARK = "#B8942E";

const NAV_ITEMS = [
    { path: "/",          icon: <FaTachometerAlt />, label: "Dashboard" },
    { path: "/customers", icon: <FaUsers />,          label: "Customers" },
    { path: "/orders",    icon: <FaShoppingCart />,   label: "Orders" },
    { path: "/loyalty",   icon: <FaStar />,           label: "Loyalty" },
    { path: "/promos",    icon: <FaTag />,            label: "Promos" },
    { path: "/reports",   icon: <FaChartBar />,       label: "Reports" },
];

export default function MainLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div style={{
            display: "flex",
            minHeight: "100vh",
            background: "#0A0C10",
            fontFamily: "'Inter', 'Segoe UI', sans-serif"
        }}>
            {/* ── Sidebar ── */}
            <aside style={{
                width: collapsed ? 72 : 240,
                minHeight: "100vh",
                background: "linear-gradient(180deg, #0D0F14 0%, #080A0E 100%)",
                display: "flex",
                flexDirection: "column",
                transition: "width 0.25s ease",
                flexShrink: 0,
                position: "sticky",
                top: 0,
                height: "100vh",
                overflowY: "auto",
                overflowX: "hidden",
                borderRight: "1px solid rgba(212, 175, 55, 0.15)"
            }}>
                {/* Logo di sidebar */}
                <div style={{
                    padding: collapsed ? "20px 0" : "24px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: collapsed ? "center" : "flex-start",
                    borderBottom: "1px solid rgba(212, 175, 55, 0.15)"
                }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 12,
                        background: "linear-gradient(135deg, #D4AF37, #B8942E)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0
                    }}>
                        <img 
                            src={logoRotte} 
                            alt="Rotte" 
                            style={{ width: 28, height: 28, objectFit: "contain" }}
                        />
                    </div>
                    {!collapsed && (
                        <div style={{ marginLeft: 12 }}>
                            <div style={{ color: "#F3F4F6", fontWeight: 800, fontSize: 18, lineHeight: 1 }}>
                                Rotte<span style={{ color: "#D4AF37" }}>.</span>
                            </div>
                            <div style={{ color: "rgba(212, 175, 55, 0.5)", fontSize: 10, marginTop: 2 }}>Bakery CRM</div>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: "20px 12px" }}>
                    {!collapsed && (
                        <div style={{
                            fontSize: 10, fontWeight: 700,
                            color: "rgba(212, 175, 55, 0.5)",
                            letterSpacing: 1.5, textTransform: "uppercase",
                            padding: "4px 10px 12px"
                        }}>Menu Utama</div>
                    )}
                    {NAV_ITEMS.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/"}
                            style={({ isActive }) => ({
                                display: "flex", alignItems: "center", gap: 12,
                                padding: collapsed ? "12px 0" : "10px 14px",
                                justifyContent: collapsed ? "center" : "flex-start",
                                borderRadius: 12, marginBottom: 4,
                                textDecoration: "none", fontSize: 13, fontWeight: 600,
                                transition: "all 0.15s",
                                background: isActive ? "rgba(212, 175, 55, 0.12)" : "transparent",
                                color: isActive ? "#D4AF37" : "rgba(255,255,255,0.5)",
                                borderLeft: isActive ? "3px solid #D4AF37" : "3px solid transparent",
                            })}
                        >
                            <span style={{ fontSize: 15, flexShrink: 0 }}>{item.icon}</span>
                            {!collapsed && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(212, 175, 55, 0.15)" }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: "100%", display: "flex", alignItems: "center", gap: 12,
                            justifyContent: collapsed ? "center" : "flex-start",
                            padding: collapsed ? "12px 0" : "10px 14px",
                            background: "none", border: "none", cursor: "pointer", borderRadius: 12,
                            color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 600,
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(212, 175, 55, 0.1)"; e.currentTarget.style.color = "#D4AF37"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
                    >
                        <FaSignOutAlt size={13} />
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                {/* Topbar */}
                <header style={{
                    background: "rgba(13, 15, 20, 0.8)",
                    backdropFilter: "blur(12px)",
                    borderBottom: "1px solid rgba(212, 175, 55, 0.15)",
                    padding: "0 28px",
                    height: 60,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    position: "sticky", top: 0, zIndex: 30,
                }}>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#D4AF37", display: "flex", alignItems: "center", padding: 4 }}
                    >
                        {collapsed ? <FaBars size={18} /> : <FaTimes size={18} />}
                    </button>

                    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                        <button style={{ background: "none", border: "none", cursor: "pointer", position: "relative", color: "#D4AF37", display: "flex" }}>
                            <FaBell size={16} />
                            <span style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, background: "#D4AF37", borderRadius: "50%", border: "1.5px solid #0D0F14" }} />
                        </button>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 12,
                                background: "linear-gradient(135deg, #D4AF37, #F5D76E)",
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                                <FaUser size={14} style={{ color: "#000" }} />
                            </div>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "#F3F4F6", lineHeight: 1 }}>Admin</div>
                                <div style={{ fontSize: 10, color: "#D4AF37" }}>Rotte Bakery</div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main style={{ flex: 1, padding: "28px 32px", minWidth: 0 }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}