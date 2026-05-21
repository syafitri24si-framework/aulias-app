// [COM] Orders page - menggunakan OrderTable component
import { useState } from "react";
import { FaPlus, FaBoxOpen } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import SearchInput from "../components/SearchInput";
import FilterTabs from "../components/FilterTabs";
import Modal from "../components/Modal";
import SummaryCard from "../components/SummaryCard";
import Card from "../components/Card";
import OrderTable from "../components/OrderTable";  // ← Pakai OrderTable
import ordersData from "../data/orders";

const PRIMARY = "#5E81F4";

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #E8ECF2",
  borderRadius: "12px",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box",
  background: "#FAFBFD",
  color: "#464A5F",
  fontFamily: "'Inter', 'Lato', sans-serif",
  transition: "all 0.2s ease"
};

export default function Orders() {
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("orderDate");
  const [form, setForm] = useState({ 
    customerName: "", 
    status: "Pending", 
    totalPrice: "", 
    orderDate: "", 
    paymentMethod: "Cash", 
    items: "" 
  });

  const filtered = ordersData
    .filter(o =>
      (statusFilter === "All" || o.status === statusFilter) &&
      (o.customerName.toLowerCase().includes(search.toLowerCase()) || 
       String(o.id).includes(search))
    )
    .sort((a, b) => {
      if (sortField === "totalPrice") return b.totalPrice - a.totalPrice;
      if (sortField === "orderDate") return new Date(b.orderDate) - new Date(a.orderDate);
      return 0;
    });

  const totalRevenue = ordersData.reduce((s, o) => s + o.totalPrice, 0);
  const completed = ordersData.filter(o => o.status === "Completed").length;
  const pending = ordersData.filter(o => o.status === "Pending").length;
  const cancelled = ordersData.filter(o => o.status === "Cancelled").length;

  const statusOptions = [
    { value: "All", label: "Semua" },
    { value: "Completed", label: "Completed" },
    { value: "Pending", label: "Pending" },
    { value: "Cancelled", label: "Cancelled" }
  ];

  return (
    <div style={{ background: "#F6F6F6", minHeight: "100vh", paddingBottom: "32px" }}>
      <PageHeader title="Orders" breadcrumb={["Dashboard", "Orders"]}>
        <Button type="primary" icon={FaPlus} onClick={() => setShowModal(true)}>
          Tambah Order
        </Button>
      </PageHeader>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
        <SummaryCard label="Total Revenue" value={`Rp ${(totalRevenue / 1000000).toFixed(1)}jt`} color={PRIMARY} />
        <SummaryCard label="Completed" value={completed} color="#7CE7AC" />
        <SummaryCard label="Pending" value={pending} color="#F4BE5E" />
        <SummaryCard label="Cancelled" value={cancelled} color="#FF808B" />
      </div>

      {/* Filter Bar */}
      <Card padding="16px 20px">
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <SearchInput 
              value={search} 
              onChange={setSearch} 
              placeholder="Cari nama / ID order..."
            />
          </div>
          <FilterTabs options={statusOptions} value={statusFilter} onChange={setStatusFilter} />
          <select 
            value={sortField} 
            onChange={e => setSortField(e.target.value)}
            style={{ 
              padding: "10px 14px", 
              border: "1px solid #E8ECF2", 
              borderRadius: "12px", 
              fontSize: "13px", 
              color: "#464A5F", 
              outline: "none", 
              background: "#FAFBFD",
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            <option value="orderDate">Terbaru</option>
            <option value="totalPrice">Harga Tertinggi</option>
          </select>
        </div>
      </Card>

      {/* Order Table - PAKAI ORDER TABLE COMPONENT */}
      <div style={{ marginTop: "20px" }}>
        <OrderTable orders={filtered} />
      </div>

      {/* Modal Tambah Order */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Tambah Order" width={440}>
        {[
          { label: "Nama Customer", key: "customerName", type: "text", placeholder: "Nama pelanggan" },
          { label: "Items (pisahkan dengan koma)", key: "items", type: "text", placeholder: "Roti Coklat, Donat, Croissant" },
          { label: "Total Harga (Rp)", key: "totalPrice", type: "number", placeholder: "50000" },
          { label: "Tanggal Order", key: "orderDate", type: "date", placeholder: "" },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#464A5F", display: "block", marginBottom: "6px" }}>
              {f.label}
            </label>
            <input 
              type={f.type} 
              placeholder={f.placeholder}
              value={form[f.key]}
              onChange={e => setForm({ ...form, [f.key]: e.target.value })}
              style={inputStyle}
            />
          </div>
        ))}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "#464A5F", display: "block", marginBottom: "6px" }}>Status</label>
          <div style={{ display: "flex", gap: "8px" }}>
            {["Pending", "Completed", "Cancelled"].map(s => (
              <button 
                key={s} 
                onClick={() => setForm({ ...form, status: s })}
                style={{
                  flex: 1, 
                  padding: "10px", 
                  borderRadius: "12px", 
                  fontSize: "12px", 
                  fontWeight: 600, 
                  cursor: "pointer",
                  border: form.status === s ? `2px solid ${PRIMARY}` : "1px solid #E8ECF2",
                  background: form.status === s ? "rgba(94, 129, 244, 0.08)" : "#FAFBFD",
                  color: form.status === s ? PRIMARY : "#8181A5",
                  transition: "all 0.2s"
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: "24px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "#464A5F", display: "block", marginBottom: "6px" }}>
            Metode Pembayaran
          </label>
          <select 
            value={form.paymentMethod} 
            onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
            style={inputStyle}
          >
            <option>Cash</option>
            <option>Transfer</option>
            <option>QRIS</option>
            <option>Kartu Kredit</option>
          </select>
        </div>
        <Button type="primary" fullWidth onClick={() => setShowModal(false)}>
          Simpan Order
        </Button>
      </Modal>
    </div>
  );
}