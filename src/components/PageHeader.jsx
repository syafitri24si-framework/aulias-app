// [COM] PageHeader component - dipercantik dengan dekorasi
export default function PageHeader({ title, breadcrumb, children, subtitle }) {
  const renderBreadcrumb = () => {
    if (Array.isArray(breadcrumb)) return breadcrumb.join(" / ");
    return breadcrumb;
  };

  return (
    <div style={{ marginBottom: "28px" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        flexWrap: "wrap", 
        gap: "16px",
        position: "relative"
      }}>
        <div>
          {/* Dekorasi garis kecil di samping title */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px",
            marginBottom: "8px"
          }}>
            <div style={{ 
              width: "4px", 
              height: "28px", 
              background: "linear-gradient(135deg, #5E81F4, #1B51E5)",
              borderRadius: "4px"
            }} />
            <h1 style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#1A1A1A",
              letterSpacing: "-0.02em",
              margin: 0,
              fontFamily: "'Inter', 'Lato', sans-serif"
            }}>
              {title}
            </h1>
          </div>
          {subtitle && (
            <div style={{ fontSize: "14px", color: "#8181A5", marginTop: "4px", marginLeft: "16px" }}>
              {subtitle}
            </div>
          )}
          {breadcrumb && (
            <div style={{
              color: "#5E81F4",
              fontSize: "13px",
              marginTop: "6px",
              marginLeft: "16px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}>
              <span style={{ color: "#AAABB0" }}>📍</span>
              {renderBreadcrumb()}
            </div>
          )}
        </div>
        {children && (
          <div style={{ 
            background: "rgba(94, 129, 244, 0.04)",
            padding: "4px",
            borderRadius: "16px"
          }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}