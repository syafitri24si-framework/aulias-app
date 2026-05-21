// [COM] FilterTabs component - dipercantik dengan efek sliding
import { useRef, useEffect, useState } from "react";

const PRIMARY = "#5E81F4";

export default function FilterTabs({ options, value, onChange }) {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const buttonsRef = useRef({});

  useEffect(() => {
    const activeButton = buttonsRef.current[value];
    if (activeButton) {
      setIndicatorStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth
      });
    }
  }, [value]);

  return (
    <div style={{ 
      display: "flex", 
      gap: "4px", 
      flexWrap: "wrap",
      background: "#F8F9FC",
      padding: "4px",
      borderRadius: "40px",
      position: "relative"
    }}>
      <div style={{
        position: "absolute",
        height: "calc(100% - 8px)",
        top: "4px",
        left: indicatorStyle.left,
        width: indicatorStyle.width,
        background: PRIMARY,
        borderRadius: "32px",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: `0 2px 8px ${PRIMARY}40`,
        pointerEvents: "none"
      }} />
      {options.map(option => (
        <button
          key={option.value}
          ref={el => buttonsRef.current[option.value] = el}
          onClick={() => onChange(option.value)}
          style={{
            padding: "8px 20px",
            borderRadius: "32px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            border: "none",
            background: "transparent",
            color: value === option.value ? "#FFF" : "#8181A5",
            transition: "all 0.2s",
            position: "relative",
            zIndex: 1,
            fontFamily: "'Inter', 'Lato', sans-serif"
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}