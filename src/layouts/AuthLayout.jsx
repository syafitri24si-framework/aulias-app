import { Outlet } from "react-router-dom";
import logoRotte from "../assets/logo_rotte.png";

export default function AuthLayout() {
    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #5E81F4 0%, #1B51E5 100%)",
            padding: 20,
            position: "relative"
        }}>
            {/* Decorative circles */}
            <div style={{
                position: "fixed", top: -80, right: -80,
                width: 320, height: 320, borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                pointerEvents: "none"
            }} />
            <div style={{
                position: "fixed", bottom: -60, left: -60,
                width: 240, height: 240, borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
                pointerEvents: "none"
            }} />

            <div style={{
                background: "#FFFFFF",
                padding: "40px 36px",
                borderRadius: 24,
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 32px 64px rgba(0,0,0,0.15)",
                width: "100%",
                maxWidth: 440,
                position: "relative"
            }}>
                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
                    <div style={{ 
                        width: 52, height: 52, borderRadius: 14,
                        background: "#5E81F4",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginRight: 12
                    }}>
                        <img 
                            src={logoRotte} 
                            alt="Rotte" 
                            style={{ width: 32, height: 32, objectFit: "contain" }}
                        />
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: "#1A1A1A", letterSpacing: "-1px" }}>
                        Rotte<span style={{ color: "#5E81F4" }}>.</span>
                    </div>
                </div>
                
                <Outlet />
                
                <p style={{ textAlign: "center", fontSize: 11, color: "#AAABB0", marginTop: 28 }}>
                    © 2025 Rotte Bakery CRM. All rights reserved.
                </p>
            </div>
        </div>
    );
}