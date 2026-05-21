// [COM] Table component - tabel reusable dengan styling modern dan jarak yang rapi
import React from "react";

export default function Table({ 
  headers, 
  children, 
  className = "", 
  hoverable = true,
  striped = false,
  compact = false
}) {
  return (
    <div style={{ 
      overflowX: "auto",
      borderRadius: "20px",
      border: "1px solid #F0F2F5",
      background: "#FFFFFF",
      boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
    }}>
      <table style={{ 
        width: "100%", 
        borderCollapse: "collapse",
        fontFamily: "'Inter', 'Lato', sans-serif",
        fontSize: compact ? "13px" : "14px"
      }}>
        <thead>
          <tr style={{ 
            background: "#F8F9FC",
            borderBottom: "1px solid #E8ECF0"
          }}>
            {headers.map((header, index) => (
              <th
                key={index}
                style={{
                  padding: compact ? "14px 20px" : "16px 24px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#5E81F4",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  borderBottom: "2px solid #E8ECF0"
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {React.Children.map(children, (child, idx) => {
            if (!child) return null;
            return React.cloneElement(child, {
              style: {
                ...(child.props.style || {}),
                background: striped && idx % 2 === 1 ? "#FAFBFD" : "transparent",
                transition: "background 0.2s ease"
              },
              onMouseEnter: hoverable ? (e) => {
                e.currentTarget.style.background = "rgba(94, 129, 244, 0.04)";
              } : undefined,
              onMouseLeave: hoverable ? (e) => {
                e.currentTarget.style.background = striped && idx % 2 === 1 ? "#FAFBFD" : "transparent";
              } : undefined
            });
          })}
        </tbody>
      </table>
    </div>
  );
}