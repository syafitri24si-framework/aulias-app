// [COM] Avatar component - dipercantik dengan gradient border
const PRIMARY = "#5E81F4";

export default function Avatar({ name, size = "md", src = null }) {
  const sizes = {
    sm: { width: 32, height: 32, fontSize: 12, borderRadius: "10px" },
    md: { width: 40, height: 40, fontSize: 14, borderRadius: "12px" },
    lg: { width: 52, height: 52, fontSize: 18, borderRadius: "16px" },
    xl: { width: 100, height: 100, fontSize: 32, borderRadius: "24px" }
  };

  const sizeStyle = sizes[size] || sizes.md;

  const getInitials = () => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(w => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{
          width: sizeStyle.width,
          height: sizeStyle.height,
          borderRadius: sizeStyle.borderRadius,
          objectFit: "cover",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: sizeStyle.width,
        height: sizeStyle.height,
        borderRadius: sizeStyle.borderRadius,
        background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY}DD)`,
        color: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: sizeStyle.fontSize,
        flexShrink: 0,
        fontFamily: "'Inter', 'Lato', sans-serif",
        boxShadow: `0 4px 12px ${PRIMARY}40`
      }}
    >
      {getInitials()}
    </div>
  );
}