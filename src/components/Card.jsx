// [COM] Card component - dipercantik dengan efek modern
import { useState } from "react";

export default function Card({ children, padding = "24px", hoverable = false, onClick, className = "" }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={className}
      style={{
        background: "#FFFFFF",
        borderRadius: "20px",
        border: "1px solid rgba(94, 129, 244, 0.08)",
        padding,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: hoverable && isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hoverable && isHovered 
          ? "0 20px 35px -12px rgba(94, 129, 244, 0.15), 0 0 0 1px rgba(94, 129, 244, 0.1)" 
          : "0 1px 3px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.03)",
        cursor: onClick ? "pointer" : "default",
        backdropFilter: "blur(0px)",
      }}
      onMouseEnter={() => hoverable && setIsHovered(true)}
      onMouseLeave={() => hoverable && setIsHovered(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}