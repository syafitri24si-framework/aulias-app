// [COM] StatCard component - dipercantik dengan gradient icon background
import Card from "./Card";

const PRIMARY = "#5E81F4";

export default function StatCard({ icon, label, value, sub, onClick, trend }) {
  const isUp = trend >= 0;
  
  return (
    <Card padding="20px" hoverable onClick={onClick}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{
          background: `linear-gradient(135deg, ${PRIMARY}15, ${PRIMARY}08)`,
          borderRadius: "16px",
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s",
        }}>
          <span style={{ color: PRIMARY, fontSize: 22 }}>{icon}</span>
        </div>
        {trend !== undefined && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px 10px",
            borderRadius: "20px",
            background: isUp ? "rgba(124, 231, 172, 0.12)" : "rgba(255, 128, 139, 0.12)",
            fontSize: "12px",
            fontWeight: 600,
            color: isUp ? "#7CE7AC" : "#FF808B",
          }}>
            <span>{isUp ? "↑" : "↓"}</span>
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div>
        <div style={{ 
          fontSize: "32px", 
          fontWeight: 800, 
          color: "#1A1A1A", 
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
          marginBottom: "4px"
        }}>{value}</div>
        <div style={{ fontSize: "14px", fontWeight: 500, color: "#5E81F4", marginBottom: "2px" }}>{label}</div>
        {sub && <div style={{ fontSize: "12px", color: "#AAABB0" }}>{sub}</div>}
      </div>
    </Card>
  );
}