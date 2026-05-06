const GOLD = "#D4AF37";

export default function PageHeader({ title, breadcrumb, children }) {
    const renderBreadcrumb = () => {
        if (Array.isArray(breadcrumb)) return breadcrumb.join(" / ");
        return breadcrumb;
    };

    return (
        <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div>
                    <div style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: "#F3F4F6",
                        letterSpacing: "-0.5px"
                    }}>
                        {title || "Dashboard"}
                    </div>
                    <div style={{
                        color: "#D4AF37",
                        fontSize: 12,
                        marginTop: 2,
                        fontWeight: 500,
                        letterSpacing: 0.3
                    }}>
                        {breadcrumb ? renderBreadcrumb() : "Dashboard"}
                    </div>
                </div>
                {children ? children : (
                    <button style={{
                        background: "linear-gradient(135deg, #D4AF37, #B8942E)",
                        color: "#000",
                        border: "none",
                        borderRadius: 12,
                        padding: "9px 18px",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer"
                    }}>
                        Tambah Order
                    </button>
                )}
            </div>
        </div>
    );
}