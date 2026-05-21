// [COM] OrderTable component - tabel order dengan jarak yang rapi
import Table from "./Table";
import StatusBadge from "./StatusBadge";
import { FaCookie } from "react-icons/fa";

const PRIMARY = "#5E81F4";

export default function OrderTable({ orders, headers, compact = false }) {
  const defaultHeaders = ["Order ID", "Customer", "Items", "Status", "Total", "Tanggal"];
  const tableHeaders = headers || defaultHeaders;

  if (!orders || orders.length === 0) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "60px 20px", 
        color: "#AAABB0",
        background: "#FFFFFF",
        borderRadius: "20px",
        border: "1px solid #F0F2F5"
      }}>
        <FaCookie size={48} style={{ display: "block", margin: "0 auto 16px", opacity: 0.3 }} />
        <div style={{ fontSize: "14px", fontWeight: 500 }}>Belum ada data order</div>
        <div style={{ fontSize: "12px", marginTop: "4px" }}>Tambahkan order baru melalui tombol di atas</div>
      </div>
    );
  }

  return (
    <Table headers={tableHeaders} compact={compact} hoverable={true}>
      {orders.map((order) => (
        <tr key={order.id}>
          {/* Order ID */}
          <td style={{ 
            padding: "16px 20px", 
            fontFamily: "monospace", 
            fontSize: "13px", 
            color: PRIMARY,
            fontWeight: 600,
            borderRadius: "20px 0 0 20px"
          }}>
            <span style={{ 
              background: "rgba(94, 129, 244, 0.08)", 
              padding: "4px 12px", 
              borderRadius: "8px",
              display: "inline-block"
            }}>
              #{order.id}
            </span>
          </td>
          
          {/* Customer Name */}
          <td style={{ 
            padding: "16px 20px", 
            fontWeight: 600, 
            color: "#1A1A1A"
          }}>
            {order.customerName}
          </td>
          
          {/* Items */}
          <td style={{ padding: "16px 20px" }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {order.items?.slice(0, 2).map((item, idx) => (
                <span 
                  key={idx} 
                  style={{ 
                    display: "inline-flex", 
                    alignItems: "center", 
                    gap: "6px", 
                    background: "rgba(94, 129, 244, 0.08)", 
                    padding: "5px 14px", 
                    borderRadius: "24px", 
                    fontSize: "12px", 
                    color: PRIMARY,
                    fontWeight: 500
                  }}
                >
                  <FaCookie size={10} /> {item}
                </span>
              ))}
              {order.items?.length > 2 && (
                <span style={{ 
                  fontSize: "12px", 
                  color: "#8181A5", 
                  padding: "5px 8px",
                  background: "#F0F2F5",
                  borderRadius: "24px"
                }}>
                  +{order.items.length - 2} lainnya
                </span>
              )}
            </div>
          </td>
          
          {/* Status */}
          <td style={{ padding: "16px 20px" }}>
            <StatusBadge status={order.status} />
          </td>
          
          {/* Total */}
          <td style={{ 
            padding: "16px 20px", 
            fontWeight: 700, 
            color: PRIMARY,
            fontSize: "14px"
          }}>
            Rp {order.totalPrice.toLocaleString()}
          </td>
          
          {/* Tanggal */}
          <td style={{ 
            padding: "16px 20px", 
            color: "#8181A5", 
            fontSize: "13px",
            whiteSpace: "nowrap"
          }}>
            {order.orderDate}
          </td>
        </tr>
      ))}
    </Table>
  );
}