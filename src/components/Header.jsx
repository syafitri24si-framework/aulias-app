import { FaBell, FaSearch } from "react-icons/fa";
import { FcAreaChart } from "react-icons/fc";
import { SlSettings } from "react-icons/sl";
import { useState } from "react";

const GOLD = "#D4AF37";
const GOLD_DARK = "#B8942E";

export default function Header() {
    const [openSearch, setOpenSearch] = useState(false);
    const [keyword, setKeyword] = useState("");

    return (
        <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: 24,
            background: "rgba(21, 23, 29, 0.8)",
            backdropFilter: "blur(12px)",
            padding: "12px 20px",
            borderRadius: 16,
            border: "1px solid rgba(212, 175, 55, 0.2)"
        }}>
            <div
                style={{ position: "relative", width: 300, cursor: "pointer" }}
                onClick={() => setOpenSearch(true)}
            >
                <FaSearch style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: 13 }} />
                <input
                    type="text"
                    placeholder="Cari sesuatu..."
                    style={{
                        width: "100%",
                        border: "1px solid rgba(212, 175, 55, 0.3)",
                        padding: "9px 14px 9px 36px",
                        borderRadius: 12,
                        fontSize: 13,
                        outline: "none",
                        color: "#E5E7EB",
                        background: "rgba(0,0,0,0.4)",
                        pointerEvents: "none",
                        boxSizing: "border-box"
                    }}
                />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ position: "relative" }}>
                    <FaBell style={{ fontSize: 18, color: "#D4AF37" }} />
                    <span style={{
                        position: "absolute", top: -4, right: -5,
                        background: "linear-gradient(135deg, #D4AF37, #F5D76E)",
                        color: "#000",
                        fontSize: 9, fontWeight: 700,
                        width: 14, height: 14, borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center"
                    }}>3</span>
                </div>
                <FcAreaChart style={{ fontSize: 20 }} />
                <SlSettings style={{ fontSize: 18, color: "#D4AF37" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#F3F4F6" }}>Admin Rotte</div>
                        <div style={{ fontSize: 10, color: "#D4AF37" }}>Superadmin</div>
                    </div>
                    <div style={{
                        width: 36, height: 36, borderRadius: 12,
                        background: "linear-gradient(135deg, #D4AF37, #F5D76E)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#000", fontWeight: 800, fontSize: 13
                    }}>AR</div>
                </div>
            </div>

            {openSearch && (
                <div
                    style={{
                        position: "fixed", inset: 0,
                        background: "rgba(0,0,0,0.7)",
                        backdropFilter: "blur(12px)",
                        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50
                    }}
                    onClick={() => setOpenSearch(false)}
                >
                    <div
                        style={{
                            background: "#15171D",
                            padding: 28,
                            borderRadius: 20,
                            width: 420,
                            border: "1px solid rgba(212, 175, 55, 0.3)",
                            boxShadow: "0 24px 64px rgba(0,0,0,0.5)"
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h2 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 700, color: "#D4AF37" }}>🔍 Pencarian</h2>
                        <input
                            type="text"
                            style={{
                                width: "100%", border: "1px solid rgba(212, 175, 55, 0.3)",
                                padding: "11px 14px", borderRadius: 12, fontSize: 14,
                                outline: "none", boxSizing: "border-box", background: "rgba(0,0,0,0.4)",
                                color: "#E5E7EB", transition: "border 0.2s"
                            }}
                            placeholder="Ketik sesuatu..."
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                            onFocus={e => e.target.style.borderColor = "#D4AF37"}
                            onBlur={e => e.target.style.borderColor = "rgba(212, 175, 55, 0.3)"}
                        />
                        {keyword && (
                            <div style={{ marginTop: 10, fontSize: 13, color: "#9CA3AF" }}>
                                Hasil pencarian: <strong style={{ color: "#D4AF37" }}>{keyword}</strong>
                            </div>
                        )}
                        <button
                            style={{
                                marginTop: 16, width: "100%",
                                background: "linear-gradient(135deg, #D4AF37, #B8942E)",
                                color: "#000",
                                border: "none", borderRadius: 12,
                                padding: "11px", fontSize: 14, fontWeight: 600,
                                cursor: "pointer"
                            }}
                            onClick={() => setOpenSearch(false)}
                        >Tutup</button>
                    </div>
                </div>
            )}
        </div>
    );
}