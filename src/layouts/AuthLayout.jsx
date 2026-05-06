import { Outlet } from "react-router-dom";
import logoRotte from "../assets/logo_rotte.png";

const GOLD = "#D4AF37";
const GOLD_DARK = "#B8942E";

export default function AuthLayout() {
    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "radial-gradient(ellipse at 30% 40%, #0A0C10 0%, #050608 100%)",
            padding: 20,
            position: "relative"
        }}>
            {/* Decorative gold circles */}
            <div style={{
                position: "fixed", top: -80, right: -80,
                width: 320, height: 320, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)",
                pointerEvents: "none"
            }} />
            <div style={{
                position: "fixed", bottom: -60, left: -60,
                width: 240, height: 240, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)",
                pointerEvents: "none"
            }} />
            <div style={{
                position: "fixed", top: "50%", left: "50%",
                width: 500, height: 500, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(212,175,55,0.03) 0%, transparent 70%)",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none"
            }} />

            <div style={{
                background: "rgba(21, 23, 29, 0.8)",
                backdropFilter: "blur(16px)",
                padding: "40px 36px",
                borderRadius: 24,
                border: "1px solid rgba(212, 175, 55, 0.3)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
                width: "100%",
                maxWidth: 440,
                position: "relative"
            }}>
                {/* Logo dengan tema hitam gold */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
                    <div style={{ 
                        width: 52, height: 52, borderRadius: 14,
                        background: "linear-gradient(135deg, #D4AF37, #B8942E)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginRight: 12
                    }}>
                        <img 
                            src={logoRotte} 
                            alt="Rotte" 
                            style={{ width: 32, height: 32, objectFit: "contain" }}
                        />
                    </div>
                    <div style={{ fontSize: 30, fontWeight: 900, color: "#F3F4F6", letterSpacing: "-1px" }}>
                        Rotte<span style={{ color: "#D4AF37" }}>.</span>
                    </div>
                </div>
                
                <Outlet />
                
                <p style={{ textAlign: "center", fontSize: 11, color: "rgba(212, 175, 55, 0.4)", marginTop: 28 }}>
                    © 2025 Rotte Bakery CRM. All rights reserved.
                </p>
            </div>
        </div>
    );
}