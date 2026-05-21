// [COM] Button component - dipercantik dengan efek modern
const PRIMARY = "#5E81F4";
const PRIMARY_DARK = "#1B51E5";

export default function Button({ 
  children, 
  type = "primary", 
  onClick, 
  disabled = false,
  size = "md",
  icon: Icon = null,
  fullWidth = false
}) {
  const types = {
    primary: { 
      bg: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
      bgHover: `linear-gradient(135deg, ${PRIMARY_DARK}, ${PRIMARY})`,
      text: "#FFF",
      shadow: "0 4px 12px rgba(94, 129, 244, 0.25)"
    },
    secondary: { 
      bg: "#F8F9FC",
      bgHover: "#EEF2F9",
      text: "#464A5F",
      shadow: "none"
    },
    danger: { 
      bg: "linear-gradient(135deg, #FF808B, #E06E78)",
      bgHover: "linear-gradient(135deg, #E06E78, #FF808B)",
      text: "#FFF",
      shadow: "0 4px 12px rgba(255, 128, 139, 0.25)"
    },
    success: { 
      bg: "linear-gradient(135deg, #7CE7AC, #6AD09A)",
      bgHover: "linear-gradient(135deg, #6AD09A, #7CE7AC)",
      text: "#FFF",
      shadow: "0 4px 12px rgba(124, 231, 172, 0.25)"
    },
    outline: { 
      bg: "transparent",
      bgHover: `linear-gradient(135deg, ${PRIMARY}10, ${PRIMARY}05)`,
      text: PRIMARY,
      border: `1.5px solid ${PRIMARY}30`,
      shadow: "none"
    }
  };

  const sizes = {
    sm: { padding: "8px 16px", fontSize: "12px", borderRadius: "10px", gap: "6px" },
    md: { padding: "10px 20px", fontSize: "14px", borderRadius: "12px", gap: "8px" },
    lg: { padding: "14px 28px", fontSize: "15px", borderRadius: "14px", gap: "10px" }
  };

  const style = types[type] || types.primary;
  const sizeStyle = sizes[size] || sizes.md;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: sizeStyle.gap,
        width: fullWidth ? "100%" : "auto",
        background: disabled ? "#E5E7EB" : style.bg,
        color: style.text,
        border: style.border || "none",
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        fontWeight: 600,
        borderRadius: sizeStyle.borderRadius,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        fontFamily: "'Inter', 'Lato', sans-serif",
        boxShadow: disabled ? "none" : style.shadow,
        letterSpacing: "0.3px",
      }}
      onMouseEnter={e => {
        if (!disabled && style.bgHover) {
          e.currentTarget.style.background = style.bgHover;
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(94, 129, 244, 0.3)";
        }
      }}
      onMouseLeave={e => {
        if (!disabled) {
          e.currentTarget.style.background = style.bg;
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = style.shadow;
        }
      }}
    >
      {Icon && <Icon size={size === "sm" ? 14 : 16} />}
      {children}
    </button>
  );
}