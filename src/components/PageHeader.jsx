export default function PageHeader({ title, breadcrumb, children }) {
    const renderBreadcrumb = () => {
        if (Array.isArray(breadcrumb)) return breadcrumb.join(" / ");
        return breadcrumb;
    };

    return (
        <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div>
                    <h1 style={{
                        fontSize: 28,
                        fontWeight: 800,
                        color: "#1A1A1A",
                        letterSpacing: "-0.5px",
                        margin: 0,
                        fontFamily: "'Lato', sans-serif"
                    }}>
                        {title || "Dashboard"}
                    </h1>
                    <div style={{
                        color: "#5E81F4",
                        fontSize: 13,
                        marginTop: 4,
                        fontWeight: 500,
                    }}>
                        {breadcrumb ? renderBreadcrumb() : "Dashboard"}
                    </div>
                </div>
                {children ? children : (
                    <button className="figma-btn-primary">
                        Tambah Order
                    </button>
                )}
            </div>
        </div>
    );
}