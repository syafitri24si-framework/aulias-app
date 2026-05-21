// [COM] Modal component - dipercantik dengan animasi
import { FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Modal({ isOpen, onClose, title, children, width = 440 }) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        animation: "fadeIn 0.2s ease"
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "28px",
          padding: "0",
          width,
          maxWidth: "90%",
          maxHeight: "85vh",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header dengan gradient line */}
        <div style={{ 
          padding: "24px 28px 16px 28px",
          borderBottom: "1px solid #F0F2F5",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative"
        }}>
          <div style={{ 
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #5E81F4, #A78BFA, #5E81F4)",
            backgroundSize: "200% 100%",
            animation: "gradientMove 2s ease infinite"
          }} />
          <h2 style={{ 
            margin: 0, 
            fontSize: "20px", 
            fontWeight: 700, 
            color: "#1A1A1A",
            letterSpacing: "-0.3px"
          }}>{title}</h2>
          <button 
            onClick={onClose} 
            style={{ 
              background: "#F0F2F5",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              color: "#8181A5",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#FF808B";
              e.currentTarget.style.color = "#FFF";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#F0F2F5";
              e.currentTarget.style.color = "#8181A5";
            }}
          >
            <FaTimes size={14} />
          </button>
        </div>
        <div style={{ padding: "24px 28px 28px 28px", overflowY: "auto", maxHeight: "calc(85vh - 80px)" }}>
          {children}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}