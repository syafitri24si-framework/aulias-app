export default function Container({ children, maxWidth = "1200px", padding = "0 24px" }) {
  return (
    <div style={{ maxWidth, margin: "0 auto", padding, width: "100%" }}>
      {children}
    </div>
  );
}