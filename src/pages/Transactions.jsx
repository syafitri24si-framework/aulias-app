// src/pages/Transactions.jsx - FULL VERSION DENGAN POIN!
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaUserPlus, FaTrash, FaPrint, FaCheck, FaShoppingCart } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Button from "../components/Button";
import { customersAPI, transactionsAPI } from "../services/supabase";

const PRIMARY = "#5E81F4";
const SUCCESS = "#7CE7AC";

// ================================================================
// DATA PRODUK
// ================================================================
const products = [
    { id: 1, name: "Roti Coklat", price: 15000 },
    { id: 2, name: "Donat Gula", price: 12000 },
    { id: 3, name: "Croissant", price: 18000 },
    { id: 4, name: "Roti Tawar", price: 28000 },
    { id: 5, name: "Roti Keju", price: 20000 },
    { id: 6, name: "Roti Sosis", price: 22000 },
    { id: 7, name: "Kue Bolu", price: 35000 },
    { id: 8, name: "Donat Coklat", price: 14000 },
];

export default function Transactions() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [customer, setCustomer] = useState(null);
    const [phone, setPhone] = useState("");
    const [cart, setCart] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(products[0]);
    const [qty, setQty] = useState(1);
    const [usePoints, setUsePoints] = useState(false);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // ============================================================
    // CARI MEMBER
    // ============================================================
    const searchMember = async () => {
        if (!phone) {
            alert("⚠️ Masukkan nomor HP!");
            return;
        }
        setLoading(true);
        try {
            const found = await customersAPI.fetchByPhone(phone);
            if (found) {
                setCustomer(found);
                alert(`✅ Ditemukan: ${found.nama_lengkap} (${found.loyalty_tier}) - ${found.points} poin`);
            } else {
                alert(`❌ Nomor ${phone} tidak terdaftar. Silakan daftar member.`);
            }
        } catch (err) {
            alert("❌ Gagal mencari member: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // TAMBAH KE KERANJANG
    // ============================================================
    const addToCart = () => {
        const existing = cart.find(item => item.id === selectedProduct.id);
        if (existing) {
            setCart(cart.map(item =>
                item.id === selectedProduct.id ? { ...item, qty: item.qty + qty } : item
            ));
        } else {
            setCart([...cart, { ...selectedProduct, qty }]);
        }
        alert(`✅ ${selectedProduct.name} x${qty} ditambahkan!`);
    };

    // ============================================================
    // HAPUS DARI KERANJANG
    // ============================================================
    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    // ============================================================
    // HITUNG TOTAL
    // ============================================================
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const pointsEarned = Math.floor(totalPrice / 1000);

    // ============================================================
    // HITUNG DISKON POIN
    // ============================================================
    const getMaxPointsDiscount = () => {
        if (!customer || !usePoints) return 0;
        // 1 poin = Rp 100, maksimal diskon = total belanja
        const maxPointsCanUse = Math.floor(totalPrice / 100);
        const pointsToUse = Math.min(customer.points || 0, maxPointsCanUse);
        return pointsToUse * 100; // total diskon dalam rupiah
    };

    const discountAmount = getMaxPointsDiscount();
    const finalTotal = Math.max(0, totalPrice - discountAmount);

    // ============================================================
    // PROSES PEMBAYARAN - DENGAN POIN!
    // ============================================================
    const processPayment = async () => {
        if (cart.length === 0) {
            alert("❌ Keranjang kosong!");
            return;
        }

        setLoading(true);

        // Hitung poin yang digunakan
        let pointsUsed = 0;
        if (usePoints && customer && customer.points > 0) {
            const maxPointsCanUse = Math.floor(totalPrice / 100);
            pointsUsed = Math.min(customer.points, maxPointsCanUse);
        }

        try {
            // 🔥 BUAT DATA TRANSAKSI
            const transactionData = {
                id_transaksi: `TRX${Date.now()}`,
                id_customer: customer?.id_customer || null,
                tanggal_transaksi: new Date().toISOString().split('T')[0],
                jam_transaksi: new Date().toTimeString().slice(0, 8),
                nama_produk: cart.map(item => item.name).join(', '),
                qty: cart.reduce((sum, item) => sum + item.qty, 0),
                harga_satuan: Math.round(totalPrice / cart.length),
                total_belanja: finalTotal,
                poin_didapat: customer ? pointsEarned : 0,
                poin_digunakan: pointsUsed,
                status: 'Completed',
                channel_penjualan: 'Offline'
            };

            // 🔥 SIMPAN KE SUPABASE!
            await transactionsAPI.create(transactionData);
            console.log("✅ Transaksi berhasil disimpan:", transactionData);

            // 🔥 REFRESH DATA CUSTOMER (poin berkurang)
            if (customer) {
                const updated = await customersAPI.fetchByPhone(customer.no_handphone);
                setCustomer(updated);
            }

            setResult({
                order: transactionData,
                customer: customer,
                pointsEarned: customer ? pointsEarned : 0,
                pointsUsed: pointsUsed,
                discountAmount: discountAmount,
                totalBefore: totalPrice,
                finalTotal: finalTotal,
            });

            setStep(3);
            alert("✅ Transaksi berhasil!");

        } catch (err) {
            console.error("❌ Error:", err);
            alert("❌ Gagal menyimpan transaksi: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // RESET
    // ============================================================
    const reset = () => {
        setStep(1);
        setCustomer(null);
        setPhone("");
        setCart([]);
        setUsePoints(false);
        setResult(null);
        setQty(1);
    };

    // ============================================================
    // CETAK STRUK
    // ============================================================
    const printStruk = () => {
        window.print();
    };

    // ============================================================
    // RENDER STEP 1: CARI MEMBER
    // ============================================================
    if (step === 1) {
        return (
            <div style={{ background: "#F6F6F6", minHeight: "100vh", paddingBottom: 32 }}>
                <PageHeader title="💳 Transaksi Kasir" breadcrumb={["Dashboard", "Transaksi"]} />

                <Card>
                    <h3 style={{ margin: "0 0 16px", fontSize: 18 }}>🔍 Langkah 1: Cari Member</h3>
                    <p style={{ color: "#8181A5", marginBottom: 16 }}>
                        Masukkan nomor handphone member. Kalau belum punya, bisa daftar dulu.
                    </p>

                    <div style={{ display: "flex", gap: 10 }}>
                        <input
                            type="text"
                            placeholder="Masukkan nomor HP..."
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            style={{
                                flex: 1,
                                padding: "12px 16px",
                                border: "1px solid #E8ECF2",
                                borderRadius: 10,
                                fontSize: 14,
                                outline: "none",
                            }}
                            onKeyDown={(e) => e.key === "Enter" && searchMember()}
                        />
                        <Button type="primary" icon={FaSearch} onClick={searchMember} disabled={loading}>
                            {loading ? "Mencari..." : "Cari"}
                        </Button>
                    </div>

                    {customer && (
                        <div style={{
                            marginTop: 16,
                            padding: 16,
                            background: "rgba(94, 129, 244, 0.05)",
                            borderRadius: 12,
                            border: "1px solid rgba(94, 129, 244, 0.2)",
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 16 }}>{customer.nama_lengkap}</div>
                                    <div style={{ color: "#8181A5", fontSize: 13 }}>{customer.no_handphone}</div>
                                    <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                                        <span style={{
                                            background: customer.loyalty_tier === "Gold" ? "rgba(94, 129, 244, 0.1)" :
                                                customer.loyalty_tier === "Silver" ? "rgba(129, 129, 165, 0.1)" :
                                                "rgba(244, 190, 94, 0.1)",
                                            color: customer.loyalty_tier === "Gold" ? PRIMARY :
                                                customer.loyalty_tier === "Silver" ? "#8181A5" : "#F4BE5E",
                                            padding: "2px 12px",
                                            borderRadius: 12,
                                            fontSize: 12,
                                            fontWeight: 600,
                                        }}>
                                            {customer.loyalty_tier}
                                        </span>
                                        <span style={{ color: PRIMARY, fontWeight: 700 }}>⭐ {customer.points} poin</span>
                                    </div>
                                </div>
                                <Button type="success" onClick={() => setStep(2)}>
                                    Lanjut →
                                </Button>
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: 16, borderTop: "1px solid #F0F0F3", paddingTop: 16 }}>
                        <p style={{ fontSize: 12, color: "#8181A5", marginBottom: 8 }}>
                            Belum punya akun member?
                        </p>
                        <Button type="secondary" icon={FaUserPlus} onClick={() => alert("📝 Buka form pendaftaran member")}>
                            Daftar Member Baru
                        </Button>
                        <Button
                            type="outline"
                            style={{ marginLeft: 8 }}
                            onClick={() => {
                                setCustomer(null);
                                setStep(2);
                            }}
                        >
                            Lanjut sebagai Non-Member
                        </Button>
                    </div>
                </Card>

                <Stepper current={1} />
            </div>
        );
    }

    // ============================================================
    // RENDER STEP 2: INPUT PRODUK
    // ============================================================
    if (step === 2) {
        const discountAmount = getMaxPointsDiscount();
        const finalTotal = Math.max(0, totalPrice - discountAmount);

        return (
            <div style={{ background: "#F6F6F6", minHeight: "100vh", paddingBottom: 32 }}>
                <PageHeader title="💳 Transaksi Kasir" breadcrumb={["Dashboard", "Transaksi"]} />

                <Card>
                    <h3 style={{ margin: "0 0 16px", fontSize: 18 }}>🛒 Langkah 2: Input Produk</h3>

                    {customer && (
                        <div style={{
                            padding: 10,
                            background: "rgba(94, 129, 244, 0.05)",
                            borderRadius: 8,
                            marginBottom: 16,
                            display: "flex",
                            justifyContent: "space-between",
                        }}>
                            <span style={{ fontWeight: 600 }}>{customer.nama_lengkap}</span>
                            <span style={{ color: PRIMARY }}>⭐ {customer.points} poin</span>
                        </div>
                    )}

                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                        <select
                            value={selectedProduct.id}
                            onChange={(e) => {
                                const p = products.find(prod => prod.id === parseInt(e.target.value));
                                setSelectedProduct(p);
                            }}
                            style={{
                                flex: 1,
                                minWidth: 200,
                                padding: "10px 14px",
                                border: "1px solid #E8ECF2",
                                borderRadius: 10,
                                fontSize: 13,
                                outline: "none",
                                background: "#FAFBFD",
                            }}
                        >
                            {products.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name} - Rp {p.price.toLocaleString()}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            value={qty}
                            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                            min={1}
                            style={{
                                width: 70,
                                padding: "10px 8px",
                                border: "1px solid #E8ECF2",
                                borderRadius: 10,
                                fontSize: 13,
                                outline: "none",
                                textAlign: "center",
                                background: "#FAFBFD",
                            }}
                        />

                        <Button type="primary" onClick={addToCart}>
                            Tambah
                        </Button>
                    </div>

                    {/* ===== KERANJANG ===== */}
                    <div style={{ marginTop: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <h4 style={{ margin: 0, fontSize: 14 }}>🧺 Keranjang ({cart.length} item)</h4>
                            {cart.length > 0 && (
                                <Button type="danger" size="sm" onClick={() => setCart([])}>
                                    Kosongkan
                                </Button>
                            )}
                        </div>

                        {cart.length === 0 ? (
                            <div style={{ textAlign: "center", padding: 24, color: "#AAABB0" }}>
                                Belum ada produk
                            </div>
                        ) : (
                            <>
                                {cart.map((item, idx) => (
                                    <div key={idx} style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "8px 0",
                                        borderBottom: "1px solid #F0F0F3",
                                    }}>
                                        <div>
                                            <span>{item.name}</span>
                                            <span style={{ fontSize: 12, color: "#8181A5", marginLeft: 8 }}>x{item.qty}</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <span style={{ fontWeight: 700, color: PRIMARY }}>
                                                Rp {(item.price * item.qty).toLocaleString()}
                                            </span>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    color: "#FF808B",
                                                    cursor: "pointer",
                                                    fontSize: 14,
                                                }}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* ===== TOTAL ===== */}
                                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "2px solid #E8ECF2" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: 14, fontWeight: 600 }}>Total:</span>
                                        <span style={{ fontSize: 20, fontWeight: 800, color: PRIMARY }}>
                                            Rp {totalPrice.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* 🔥 TAMPILAN DISKON POIN */}
                                    {usePoints && customer && customer.points > 0 && discountAmount > 0 && (
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginTop: 4,
                                            padding: "8px 12px",
                                            background: "rgba(124, 231, 172, 0.08)",
                                            borderRadius: 8,
                                            border: "1px solid rgba(124, 231, 172, 0.2)"
                                        }}>
                                            <span style={{ fontSize: 13, color: "#065F46" }}>
                                                💎 Diskon Poin
                                            </span>
                                            <span style={{ fontSize: 14, fontWeight: 700, color: "#065F46" }}>
                                                - Rp {discountAmount.toLocaleString()}
                                            </span>
                                        </div>
                                    )}

                                    {/* 🔥 TOTAL SETELAH DISKON */}
                                    {usePoints && customer && customer.points > 0 && discountAmount > 0 && (
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginTop: 4,
                                            padding: "8px 12px",
                                            background: "rgba(94, 129, 244, 0.05)",
                                            borderRadius: 8,
                                            border: "1px solid rgba(94, 129, 244, 0.2)"
                                        }}>
                                            <span style={{ fontSize: 14, fontWeight: 700, color: PRIMARY }}>
                                                💰 Total Setelah Diskon
                                            </span>
                                            <span style={{ fontSize: 18, fontWeight: 800, color: PRIMARY }}>
                                                Rp {finalTotal.toLocaleString()}
                                            </span>
                                        </div>
                                    )}

                                    {/* 🔥 OPSI PAKAI POIN */}
                                    {customer && customer.points > 0 && (
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                                            <input
                                                type="checkbox"
                                                id="usePoints"
                                                checked={usePoints}
                                                onChange={(e) => setUsePoints(e.target.checked)}
                                                style={{
                                                    width: 18,
                                                    height: 18,
                                                    accentColor: PRIMARY,
                                                    cursor: "pointer"
                                                }}
                                            />
                                            <label htmlFor="usePoints" style={{ fontSize: 13, cursor: "pointer" }}>
                                                💎 Gunakan poin ({customer.points} poin tersedia)
                                                {usePoints && discountAmount > 0 && (
                                                    <span style={{ color: PRIMARY, fontWeight: 700, marginLeft: 8 }}>
                                                        (potongan Rp {discountAmount.toLocaleString()})
                                                    </span>
                                                )}
                                                {usePoints && discountAmount === 0 && customer.points > 0 && (
                                                    <span style={{ color: "#FF808B", fontWeight: 600, marginLeft: 8 }}>
                                                        (poin tidak cukup)
                                                    </span>
                                                )}
                                            </label>
                                        </div>
                                    )}

                                    <div style={{ fontSize: 12, color: "#8181A5", marginTop: 4 }}>
                                        ✨ Poin yang akan didapat: {pointsEarned} poin
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* ===== TOMBOL ===== */}
                    <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                        <Button type="secondary" onClick={() => setStep(1)}>
                            ← Kembali
                        </Button>
                        <Button
                            type="success"
                            onClick={processPayment}
                            disabled={cart.length === 0 || loading}
                            icon={FaCheck}
                        >
                            {loading ? "Memproses..." : "💳 Bayar Sekarang"}
                        </Button>
                    </div>
                </Card>

                <Stepper current={2} />
            </div>
        );
    }

    // ============================================================
    // RENDER STEP 3: SELESAI
    // ============================================================
    if (step === 3 && result) {
        const { order, customer, pointsEarned, pointsUsed, discountAmount, totalBefore, finalTotal } = result;

        return (
            <div style={{ background: "#F6F6F6", minHeight: "100vh", paddingBottom: 32 }}>
                <PageHeader title="💳 Transaksi Kasir" breadcrumb={["Dashboard", "Transaksi"]} />

                <Card>
                    <div style={{ textAlign: "center", padding: "20px 0" }}>
                        <div style={{
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            background: "rgba(124, 231, 172, 0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 16px",
                            fontSize: 32,
                        }}>
                            ✅
                        </div>
                        <h2 style={{ margin: 0, fontSize: 22 }}>Transaksi Berhasil!</h2>
                        <p style={{ color: "#8181A5" }}>Order #{order.id_transaksi?.slice(0, 8)}</p>
                    </div>

                    {/* ===== DETAIL ===== */}
                    <div style={{
                        background: "#FAFBFD",
                        borderRadius: 12,
                        padding: 16,
                        margin: "16px 0",
                        border: "1px solid #F0F0F3",
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ color: "#8181A5" }}>Customer</span>
                            <span style={{ fontWeight: 600 }}>{customer?.nama_lengkap || "Non-Member"}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ color: "#8181A5" }}>Items</span>
                            <span style={{ fontWeight: 600 }}>{order.nama_produk}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ color: "#8181A5" }}>Total Awal</span>
                            <span>Rp {totalBefore.toLocaleString()}</span>
                        </div>
                        {pointsUsed > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, color: "#7CE7AC" }}>
                                <span>Diskon Poin ({pointsUsed} poin)</span>
                                <span>- Rp {discountAmount.toLocaleString()}</span>
                            </div>
                        )}
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderTop: "2px solid #E8ECF2",
                            paddingTop: 8,
                            marginTop: 4,
                        }}>
                            <span style={{ fontSize: 16, fontWeight: 700 }}>Total Dibayar</span>
                            <span style={{ fontSize: 18, fontWeight: 800, color: PRIMARY }}>
                                Rp {finalTotal.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* ===== INFO POIN ===== */}
                    {customer && (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr",
                            gap: 10,
                            marginBottom: 16,
                        }}>
                            <div style={{ textAlign: "center", padding: 12, background: "rgba(94, 129, 244, 0.05)", borderRadius: 8 }}>
                                <div style={{ fontSize: 11, color: "#8181A5" }}>Poin Didapat</div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: PRIMARY }}>+{pointsEarned}</div>
                            </div>
                            <div style={{ textAlign: "center", padding: 12, background: "rgba(244, 190, 94, 0.05)", borderRadius: 8 }}>
                                <div style={{ fontSize: 11, color: "#8181A5" }}>Poin Digunakan</div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: "#F4BE5E" }}>-{pointsUsed}</div>
                            </div>
                            <div style={{ textAlign: "center", padding: 12, background: "rgba(124, 231, 172, 0.05)", borderRadius: 8 }}>
                                <div style={{ fontSize: 11, color: "#8181A5" }}>Total Poin</div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: "#7CE7AC" }}>
                                    {(customer.points || 0) - pointsUsed + pointsEarned}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== TIER INFO ===== */}
                    {customer && (
                        <div style={{
                            padding: 12,
                            background: customer.loyalty_tier === "Gold" ? "rgba(94, 129, 244, 0.05)" :
                                customer.loyalty_tier === "Silver" ? "rgba(129, 129, 165, 0.05)" :
                                "rgba(244, 190, 94, 0.05)",
                            borderRadius: 8,
                            marginBottom: 16,
                            textAlign: "center",
                            fontWeight: 600,
                            color: customer.loyalty_tier === "Gold" ? PRIMARY :
                                customer.loyalty_tier === "Silver" ? "#8181A5" : "#F4BE5E",
                        }}>
                            🏆 Tier Saat Ini: {customer.loyalty_tier}
                        </div>
                    )}

                    {/* ===== TOMBOL ===== */}
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <Button type="secondary" onClick={printStruk} icon={FaPrint}>
                            🖨️ Cetak Struk
                        </Button>
                        <Button type="primary" onClick={reset} icon={FaShoppingCart}>
                            🔄 Transaksi Baru
                        </Button>
                        <Button
                            type="outline"
                            onClick={() => navigate("/orders")}
                            style={{
                                borderColor: PRIMARY,
                                color: PRIMARY
                            }}
                        >
                            📦 Lihat Orders
                        </Button>
                    </div>
                </Card>

                <Stepper current={3} />
            </div>
        );
    }

    return null;
}

// ================================================================
// KOMPONEN STEPPER
// ================================================================
function Stepper({ current }) {
    const steps = [
        { num: 1, label: "Cari Member" },
        { num: 2, label: "Input Produk" },
        { num: 3, label: "Selesai" },
    ];

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            marginTop: 24,
            background: "#FFFFFF",
            padding: "16px",
            borderRadius: 12,
            border: "1px solid #F0F0F3",
        }}>
            {steps.map((step, idx) => (
                <div key={step.num} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: current >= step.num ? PRIMARY : "#E8ECF2",
                        color: current >= step.num ? "#FFF" : "#8181A5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                    }}>
                        {current > step.num ? "✓" : step.num}
                    </div>
                    <span style={{
                        fontSize: 12,
                        color: current >= step.num ? PRIMARY : "#8181A5",
                    }}>
                        {step.label}
                    </span>
                    {idx < steps.length - 1 && (
                        <div style={{
                            width: 30,
                            height: 2,
                            background: current > step.num ? PRIMARY : "#E8ECF2",
                            margin: "0 4px",
                        }} />
                    )}
                </div>
            ))}
        </div>
    );
}