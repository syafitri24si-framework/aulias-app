import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    FaTachometerAlt, FaUsers, FaShoppingCart, FaStar, FaTag,
    FaChartBar, FaSignOutAlt, FaBars, FaTimes, FaBell, FaUser,
    FaSearch, FaUserCog
} from "react-icons/fa";
import logoRotte from "../assets/logo_rotte.png";

const PRIMARY = "#5E81F4";
const PRIMARY_DARK = "#1B51E5";

// Base NAV_ITEMS untuk semua user
const BASE_NAV_ITEMS = [
    { path: "/dashboard", icon: <FaTachometerAlt size={16} />, label: "Dashboard" },
    { path: "/customers", icon: <FaUsers size={16} />, label: "Customers" },
    { path: "/orders", icon: <FaShoppingCart size={16} />, label: "Orders" },
    { path: "/loyalty", icon: <FaStar size={16} />, label: "Loyalty" },
    { path: "/promos", icon: <FaTag size={16} />, label: "Promos" },
    { path: "/reports", icon: <FaChartBar size={16} />, label: "Reports" },
];

// NAV_ITEMS untuk admin (tambah Users)
const ADMIN_NAV_ITEMS = [
    ...BASE_NAV_ITEMS,
    { path: "/users", icon: <FaUserCog size={16} />, label: "Users" },
];

export default function MainLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    // Ambil data user dari localStorage
    const userData = localStorage.getItem("user");
    let userRole = "staff";
    let userName = "User";
    let isAdmin = false;

    if (userData) {
        try {
            const user = JSON.parse(userData);
            userRole = user.role || "staff";
            userName = user.full_name || user.email || "User";
            isAdmin = userRole === "admin";
        } catch (e) {
            console.error("Error parsing user data:", e);
        }
    }

    // Pilih NAV_ITEMS berdasarkan role
    const NAV_ITEMS = isAdmin ? ADMIN_NAV_ITEMS : BASE_NAV_ITEMS;

    // Debug di console
    console.log("👤 User Role:", userRole);
    console.log("👑 Is Admin:", isAdmin);
    console.log("📋 Menu Items:", NAV_ITEMS.map(item => item.label));

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div style={{
            display: "flex",
            minHeight: "100vh",
            background: "#F6F6F6",
            fontFamily: "'Lato', sans-serif"
        }}>
            {/* Sidebar */}
            <aside style={{
                width: collapsed ? 72 : 260,
                minHeight: "100vh",
                background: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                transition: "width 0.25s ease",
                flexShrink: 0,
                position: "sticky",
                top: 0,
                height: "100vh",
                overflowY: "auto",
                overflowX: "hidden",
                borderRight: "1px solid #F0F0F3",
                boxShadow: "2px 0 8px rgba(0,0,0,0.02)"
            }}>
                {/* Logo */}
                <div style={{
                    padding: collapsed ? "20px 0" : "24px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: collapsed ? "center" : "flex-start",
                    borderBottom: "1px solid #F0F0F3"
                }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 12,
                        background: PRIMARY,
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
                            <div style={{ color: "#1A1A1A", fontWeight: 800, fontSize: 18, lineHeight: 1 }}>
                                Rotte<span style={{ color: PRIMARY }}>.</span>
                            </div>
                            <div style={{ color: "#8181A5", fontSize: 10, marginTop: 2 }}>Bakery CRM</div>
                        </div>
                    )}
                </div>

                {/* Nav Menu */}
                <nav style={{ flex: 1, padding: "20px 12px" }}>
                    {!collapsed && (
                        <div style={{
                            fontSize: 10, fontWeight: 700,
                            color: "#8181A5",
                            letterSpacing: 1.5, textTransform: "uppercase",
                            padding: "4px 10px 12px"
                        }}>Menu Utama</div>
                    )}
                    {NAV_ITEMS.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/dashboard"}
                            style={({ isActive }) => ({
                                display: "flex", alignItems: "center", gap: 12,
                                padding: collapsed ? "12px 0" : "10px 14px",
                                justifyContent: collapsed ? "center" : "flex-start",
                                borderRadius: 10, marginBottom: 4,
                                textDecoration: "none", fontSize: 14, fontWeight: 600,
                                transition: "all 0.2s",
                                background: isActive ? "rgba(94, 129, 244, 0.1)" : "transparent",
                                color: isActive ? PRIMARY : "#464A5F",
                                borderLeft: isActive ? "3px solid #5E81F4" : "3px solid transparent",
                            })}
                        >
                            <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                            {!collapsed && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout Button */}
                <div style={{ padding: "16px 12px", borderTop: "1px solid #F0F0F3" }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: "100%", display: "flex", alignItems: "center", gap: 12,
                            justifyContent: collapsed ? "center" : "flex-start",
                            padding: collapsed ? "12px 0" : "10px 14px",
                            background: "none", border: "none", cursor: "pointer", borderRadius: 10,
                            color: "#8181A5", fontSize: 14, fontWeight: 600,
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(94, 129, 244, 0.1)"; e.currentTarget.style.color = PRIMARY; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#8181A5"; }}
                    >
                        <FaSignOutAlt size={14} />
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                {/* Topbar Header */}
                <header style={{
                    background: "#FFFFFF",
                    borderBottom: "1px solid #F0F0F3",
                    padding: "0 28px",
                    height: 64,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    position: "sticky", top: 0, zIndex: 30,
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: PRIMARY, display: "flex", alignItems: "center", padding: 8, borderRadius: 8 }}
                        >
                            {collapsed ? <FaBars size={18} /> : <FaTimes size={18} />}
                        </button>
                        <div style={{ position: "relative", width: 280 }}>
                            <FaSearch style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#AAABB0", fontSize: 14 }} />
                            <input
                                type="text"
                                placeholder="Search..."
                                style={{
                                    width: "100%",
                                    border: "1px solid #ECECF2",
                                    padding: "9px 14px 9px 38px",
                                    borderRadius: 10,
                                    fontSize: 13,
                                    outline: "none",
                                    color: "#464A5F",
                                    background: "#F5F5FA",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                        <button style={{ background: "none", border: "none", cursor: "pointer", position: "relative", color: PRIMARY, display: "flex", padding: 8, borderRadius: 8 }}>
                            <FaBell size={17} />
                            <span style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, background: "#FF808B", borderRadius: "50%", border: "2px solid #FFF" }} />
                        </button>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 12,
                                background: PRIMARY,
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                                <FaUser size={14} style={{ color: "#FFF" }} />
                            </div>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", lineHeight: 1 }}>{userName}</div>
                                <div style={{ fontSize: 11, color: PRIMARY }}>{userRole}</div>
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