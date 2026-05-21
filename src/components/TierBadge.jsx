// [COM] TierBadge component - dipercantik dengan efek glow
import { FaCrown, FaTrophy, FaMedal, FaUser } from "react-icons/fa";

const TIER_STYLE = {
  Gold: { 
    bg: "linear-gradient(135deg, rgba(94, 129, 244, 0.15), rgba(94, 129, 244, 0.05))",
    color: "#5E81F4",
    icon: FaCrown,
    glow: "0 0 12px rgba(94, 129, 244, 0.3)"
  },
  Silver: { 
    bg: "linear-gradient(135deg, rgba(129, 129, 165, 0.15), rgba(129, 129, 165, 0.05))",
    color: "#8181A5",
    icon: FaTrophy,
    glow: "none"
  },
  Bronze: { 
    bg: "linear-gradient(135deg, rgba(244, 190, 94, 0.15), rgba(244, 190, 94, 0.05))",
    color: "#F4BE5E",
    icon: FaMedal,
    glow: "none"
  },
  None: { 
    bg: "#F0F2F5",
    color: "#8181A5",
    icon: FaUser,
    glow: "none"
  }
};

export default function TierBadge({ tier }) {
  const s = TIER_STYLE[tier] || TIER_STYLE.None;
  const Icon = s.icon;

  return (
    <span style={{
      background: s.bg,
      color: s.color,
      border: "none",
      padding: "5px 14px",
      borderRadius: "30px",
      fontSize: "12px",
      fontWeight: 600,
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      fontFamily: "'Inter', 'Lato', sans-serif",
      backdropFilter: "blur(4px)",
      boxShadow: s.glow
    }}>
      <Icon size={12} /> 
      {tier === "None" ? "Non-Member" : tier}
    </span>
  );
}