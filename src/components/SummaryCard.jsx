// [COM] SummaryCard component - untuk menampilkan kartu ringkasan statistik
export default function SummaryCard({ label, value, color }) {
  return (
    <div style={{
      background: "#FFFFFF",
      borderRadius: 14,
      padding: "16px 20px",
      border: "1px solid #F0F0F3",
      flex: 1,
      borderTop: `3px solid ${color}`
    }}>
      <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 12, color: "#8181A5", marginTop: 3 }}>{label}</div>
    </div>
  );
}