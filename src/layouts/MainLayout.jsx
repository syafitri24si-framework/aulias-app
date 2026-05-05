import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    FaTachometerAlt, FaUsers, FaShoppingCart, FaStar, FaTag,
    FaChartBar, FaSignOutAlt, FaBars, FaTimes, FaBreadSlice, FaBell, FaUser
} from "react-icons/fa";


const MAROON = "#7B1C1C";
const MAROON_DARK = "#5A1313";


const NAV_ITEMS = [
    { path: "/",         icon: <FaTachometerAlt />, label: "Dashboard" },
    { path: "/customers",icon: <FaUsers />,          label: "Customers" },
    { path: "/orders",   icon: <FaShoppingCart />,   label: "Orders" },
    { path: "/loyalty",  icon: <FaStar />,           label: "Loyalty" },
    { path: "/promos",   icon: <FaTag />,            label: "Promos" },
    { path: "/reports",  icon: <FaChartBar />,       label: "Reports" },
];


export default function MainLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();


    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };


    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#F7F7F7", fontFamily: "Barlow, sans-serif" }}>


            {/* ── Sidebar ── */}
            <aside style={{
                width: collapsed ? 68 : 230,
                minHeight: "100vh",
                background: MAROON_DARK,
                display: "flex",
                flexDirection: "column",
                transition: "width 0.25s ease",
                flexShrink: 0,
                position: "sticky",
                top: 0,
                height: "100vh",
                overflowY: "auto",
                overflowX: "hidden",
            }}>
                {/* Logo */}
                <div style={{ padding: collapsed ? "18px 0" : "20px 18px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.08)", justifyContent: collapsed ? "center" : "flex-start" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🥐</div>
                    {!collapsed && (
                        <div>
                            <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, lineHeight: 1 }}>Rotte Bakery</div>
                            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, marginTop: 2 }}>CRM Dashboard</div>
                        </div>
                    )}
                </div>


                {/* Nav */}
                <nav style={{ flex: 1, padding: "12px 8px" }}>
                    {!collapsed && <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1, textTransform: "uppercase", padding: "6px 10px 10px" }}>Menu</div>}
                    {NAV_ITEMS.map(item => (
                        <NavLink key={item.path} to={item.path} end={item.path === "/"}
                            style={({ isActive }) => ({
                                display: "flex", alignItems: "center", gap: 10,
                                padding: collapsed ? "11px 0" : "11px 12px",
                                justifyContent: collapsed ? "center" : "flex-start",
                                borderRadius: 10, marginBottom: 2,
                                textDecoration: "none", fontSize: 13, fontWeight: 600, transition: "all 0.15s",
                                background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                                color: isActive ? "#fff" : "rgba(255,255,255,0.55)",
                                borderLeft: isActive ? "3px solid #fff" : "3px solid transparent",
                            })}
                        >
                            <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                            {!collapsed && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>


                {/* Logout */}
                <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                    <button onClick={handleLogout}
                        style={{
                            width: "100%", display: "flex", alignItems: "center", gap: 10,
                            justifyContent: collapsed ? "center" : "flex-start",
                            padding: collapsed ? "11px 0" : "11px 12px",
                            background: "none", border: "none", cursor: "pointer", borderRadius: 10,
                            color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 600,
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                    >
                        <FaSignOutAlt size={14} />
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>


            {/* ── Main Content ── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>


                {/* Topbar */}
                <header style={{
                    background: "#fff", borderBottom: "1px solid #EEEEEE",
                    padding: "0 24px", height: 56,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    position: "sticky", top: 0, zIndex: 30,
                }}>
                    <button onClick={() => setCollapsed(!collapsed)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#666", display: "flex", alignItems: "center", padding: 4 }}>
                        {collapsed ? <FaBars size={16} /> : <FaTimes size={16} />}
                    </button>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        {/* Notification Bell */}
                        <button style={{ background: "none", border: "none", cursor: "pointer", position: "relative", color: "#888", display: "flex" }}>
                            <FaBell size={16} />
                            <span style={{ position: "absolute", top: -2, right: -2, width: 7, height: 7, background: MAROON, borderRadius: "50%", border: "1.5px solid #fff" }} />
                        </button>
                        {/* Avatar */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: MAROON, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <FaUser size={13} style={{ color: "#fff" }} />
                            </div>
                            <div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: "#333", lineHeight: 1 }}>Admin</div>
                                <div style={{ fontSize: 10, color: "#AAA" }}>Rotte Bakery</div>
                            </div>
                        </div>
                    </div>
                </header>


                {/* Page Content */}
                <main style={{ flex: 1, padding: "24px 28px", minWidth: 0 }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

