// [COM] SearchInput component - dipercantik dengan efek focus
import { FaSearch, FaTimes } from "react-icons/fa";
import { useState } from "react";

export default function SearchInput({ value, onChange, placeholder = "Cari...", onClear }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <FaSearch style={{
        position: "absolute",
        left: "14px",
        top: "50%",
        transform: "translateY(-50%)",
        color: isFocused ? "#5E81F4" : "#AAABB0",
        fontSize: "15px",
        transition: "color 0.2s ease",
        pointerEvents: "none"
      }} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          width: "100%",
          border: isFocused ? "1.5px solid #5E81F4" : "1px solid #E8ECF2",
          padding: "12px 16px 12px 44px",
          borderRadius: "14px",
          fontSize: "14px",
          outline: "none",
          boxSizing: "border-box",
          background: isFocused ? "#FFFFFF" : "#FAFBFD",
          color: "#1A1A1A",
          fontFamily: "'Inter', 'Lato', sans-serif",
          transition: "all 0.2s ease",
          boxShadow: isFocused ? "0 0 0 3px rgba(94, 129, 244, 0.1)" : "none"
        }}
      />
      {value && onClear && (
        <button
          onClick={onClear}
          style={{
            position: "absolute",
            right: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "#F0F2F5",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            color: "#8181A5",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#E4E7EC";
            e.currentTarget.style.color = "#5E81F4";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "#F0F2F5";
            e.currentTarget.style.color = "#8181A5";
          }}
        >
          <FaTimes size={12} />
        </button>
      )}
    </div>
  );
}