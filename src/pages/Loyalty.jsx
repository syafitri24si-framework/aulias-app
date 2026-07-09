// src/pages/Loyalty.jsx - LENGKAP DENGAN SUPABASE + REFRESH!
import { useState, useEffect, useRef, useCallback } from "react";
import { FaStar, FaMedal, FaTrophy, FaCrown, FaCookie, FaSync } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Card from "../components/Card";
import Avatar from "../components/Avatar";
import TierBadge from "../components/TierBadge";
import { customersAPI, transactionsAPI } from "../services/supabase";

const PRIMARY = "#5E81F4";
const WARNING = "#F4BE5E";

const TIER = {
  Gold: { icon: <FaCrown />, bg: "rgba(94, 129, 244, 0.1)", color: PRIMARY, next: null, nextPts: null, bar: PRIMARY },
  Silver: { icon: <FaTrophy />, bg: "rgba(129, 129, 165, 0.1)", color: "#8181A5", next: "Gold", nextPts: 1000, bar: "#8181A5" },
  Bronze: { icon: <FaMedal />, bg: "rgba(244, 190, 94, 0.1)", color: WARNING, next: "Silver", nextPts: 500, bar: WARNING },
  None: { icon: <FaStar />, bg: "rgba(170, 171, 176, 0.1)", color: "#AAABB0", next: "Bronze", nextPts: 100, bar: "#AAABB0" },
};

// Komponen Progress Bar
function ProgressBar({ value, max, color }) {
  const pct = max ? Math.min((value / max) * 100, 100) : 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: "#F0F0F3", borderRadius: 3 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontSize: 11, color: "#8181A5", minWidth: 36, textAlign: "right" }}>{Math.round(pct)}%</span>
    </div>
  );
}

export default function Loyalty() {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // ============================================================
  // 🔥 FUNGSI LOAD DATA
  // ============================================================
  const loadData = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      console.log("🔄 Loading loyalty data...");
      
      const [custData, transData] = await Promise.all([
        customersAPI.fetchAll(),
        transactionsAPI.fetchAll()
      ]);

      console.log("📊 Customers loaded:", custData?.length || 0);
      console.log("📊 Transactions loaded:", transData?.length || 0);

      // 🔥 FILTER: HANYA TAMPILKAN MEMBER (loyalty_tier != 'None')
      const members = (custData || []).filter(c => c.loyalty_tier !== "None");
      console.log("📊 Members (excluding None):", members.length);

      setCustomers(custData || []);
      setTransactions(transData || []);
      setLastUpdated(new Date().toLocaleTimeString());

    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      if (showRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  // ============================================================
  // LOAD DATA PERTAMA KALI
  // ============================================================
  useEffect(() => {
    loadData();
  }, []);

  // ============================================================
  // AUTO REFRESH SETIAP 30 DETIK
  // ============================================================
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("🔄 Auto-refresh loyalty...");
      loadData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [loadData]);

  // ============================================================
  // MANUAL REFRESH
  // ============================================================
  const handleRefresh = () => {
    loadData(true);
  };

  // Get customer favorite item
  const getFavoriteItem = (customerId) => {
    const customerTrans = transactions.filter(t => t.id_customer === customerId);
    const itemCount = {};
    customerTrans.forEach(t => {
      const items = t.nama_produk?.split(',').map(i => i.trim()) || [];
      items.forEach(item => {
        itemCount[item] = (itemCount[item] || 0) + 1;
      });
    });
    const favorite = Object.entries(itemCount).sort((a, b) => b[1] - a[1])[0];
    return favorite ? favorite[0] : "-";
  };

  // 🔥 FILTER: HANYA MEMBER (bukan None)
  const members = customers.filter(c => c.loyalty_tier !== "None");
  const gold = customers.filter(c => c.loyalty_tier === "Gold").length;
  const silver = customers.filter(c => c.loyalty_tier === "Silver").length;
  const bronze = customers.filter(c => c.loyalty_tier === "Bronze").length;
  const nonMember = customers.filter(c => c.loyalty_tier === "None").length;

  const totalPoints = members.reduce((s, c) => s + (c.points || 0), 0);
  const avgPoints = members.length ? Math.round(totalPoints / members.length) : 0;

  const membersWithFavorites = members.map(c => ({
    ...c,
    favoriteItem: getFavoriteItem(c.id_customer)
  }));

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "60vh" 
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "3px solid #E8ECF2",
            borderTop: `3px solid ${PRIMARY}`,
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 12px"
          }} />
          <p style={{ color: "#8181A5" }}>Memuat data loyalitas...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#F6F6F6", minHeight: "100vh", paddingBottom: 32 }}>
      <PageHeader title="Loyalty Program" breadcrumb={["Dashboard", "Loyalty"]}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {lastUpdated && (
            <span style={{ 
              fontSize: 11, 
              color: "#8181A5",
              background: "#F0F0F3",
              padding: "4px 12px",
              borderRadius: 12
            }}>
              🕐 {lastUpdated}
            </span>
          )}
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              background: PRIMARY,
              color: "#FFF",
              border: "none",
              borderRadius: 8,
              cursor: refreshing ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: 13,
              opacity: refreshing ? 0.6 : 1,
              transition: "all 0.2s"
            }}
            onMouseEnter={e => {
              if (!refreshing) e.currentTarget.style.background = "#1B51E5";
            }}
            onMouseLeave={e => {
              if (!refreshing) e.currentTarget.style.background = PRIMARY;
            }}
          >
            <FaSync style={{ 
              animation: refreshing ? "spin 0.8s linear infinite" : "none" 
            }} />
            {refreshing ? "Memuat..." : "Refresh"}
          </button>
        </div>
      </PageHeader>

      {/* Tier Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
        <Card padding="20px 22px">
          <div style={{ background: "rgba(94, 129, 244, 0.1)", borderRadius: 14, padding: "20px 22px", border: "1px solid rgba(94, 129, 244, 0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <FaCrown style={{ fontSize: 22, color: PRIMARY }} />
              <span style={{ fontSize: 32, fontWeight: 800, color: PRIMARY }}>{gold}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: PRIMARY }}>Gold Member</div>
            <div style={{ fontSize: 11, color: PRIMARY + "99" }}>Tier tertinggi</div>
          </div>
        </Card>
        <Card padding="20px 22px">
          <div style={{ background: "rgba(129, 129, 165, 0.1)", borderRadius: 14, padding: "20px 22px", border: "1px solid rgba(129, 129, 165, 0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <FaTrophy style={{ fontSize: 22, color: "#8181A5" }} />
              <span style={{ fontSize: 32, fontWeight: 800, color: "#8181A5" }}>{silver}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#8181A5" }}>Silver Member</div>
            <div style={{ fontSize: 11, color: "#8181A5" + "99" }}>Tier menengah</div>
          </div>
        </Card>
        <Card padding="20px 22px">
          <div style={{ background: "rgba(244, 190, 94, 0.1)", borderRadius: 14, padding: "20px 22px", border: "1px solid rgba(244, 190, 94, 0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <FaMedal style={{ fontSize: 22, color: WARNING }} />
              <span style={{ fontSize: 32, fontWeight: 800, color: WARNING }}>{bronze}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: WARNING }}>Bronze Member</div>
            <div style={{ fontSize: 11, color: WARNING + "99" }}>Tier pemula</div>
          </div>
        </Card>
        <Card padding="20px 22px">
          <div style={{ background: "rgba(170, 171, 176, 0.1)", borderRadius: 14, padding: "20px 22px", border: "1px solid rgba(170, 171, 176, 0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <FaStar style={{ fontSize: 22, color: "#AAABB0" }} />
              <span style={{ fontSize: 32, fontWeight: 800, color: "#AAABB0" }}>{nonMember}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#AAABB0" }}>Non Member</div>
            <div style={{ fontSize: 11, color: "#AAABB0" + "99" }}>Belum bergabung</div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 16 }}>
        {/* Statistik */}
        <Card padding="22px 24px">
          <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>📊 Statistik</div>
          <div style={{ fontSize: 12, color: PRIMARY, marginBottom: 20 }}>Ringkasan program loyalitas</div>
          
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ color: "#8181A5" }}>Total Member</span>
            <span style={{ fontWeight: 700, color: "#1A1A1A" }}>{members.length}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ color: "#8181A5" }}>Total Poin Beredar</span>
            <span style={{ fontWeight: 700, color: PRIMARY }}>{totalPoints.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#8181A5" }}>Rata-rata Poin</span>
            <span style={{ fontWeight: 700, color: "#1A1A1A" }}>{avgPoints}</span>
          </div>
        </Card>

        {/* Member List */}
        <Card padding="22px 24px">
          <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>👥 Member</div>
          <div style={{ fontSize: 12, color: PRIMARY, marginBottom: 20 }}>Progress menuju tier berikutnya</div>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #F0F0F3" }}>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, color: "#8181A5" }}>Member</th>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, color: "#8181A5" }}>Tier</th>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, color: "#8181A5" }}>Poin</th>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, color: "#8181A5" }}>Favorit</th>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, color: "#8181A5" }}>Progress</th>
                </tr>
              </thead>
              <tbody>
                {membersWithFavorites.slice(0, 10).map(c => {
                  const t = TIER[c.loyalty_tier] || TIER.None;
                  return (
                    <tr key={c.id_customer} style={{ borderBottom: "1px solid #F0F0F3" }}>
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Avatar name={c.nama_lengkap} size="sm" />
                          <span style={{ fontWeight: 600, fontSize: 13 }}>{c.nama_lengkap}</span>
                        </div>
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <TierBadge tier={c.loyalty_tier} />
                      </td>
                      <td style={{ padding: "10px 12px", fontWeight: 700, color: PRIMARY }}>
                        {c.points || 0}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(94, 129, 244, 0.08)", padding: "3px 10px", borderRadius: 20, width: "fit-content" }}>
                          <FaCookie size={10} style={{ color: PRIMARY }} />
                          <span style={{ fontSize: 12, color: PRIMARY }}>{c.favoriteItem}</span>
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        {t.nextPts ? (
                          <>
                            <ProgressBar value={c.points || 0} max={t.nextPts} color={t.bar} />
                            <div style={{ fontSize: 10, color: "#8181A5", marginTop: 3 }}>
                              {Math.max(0, t.nextPts - (c.points || 0))} poin lagi → {t.next}
                            </div>
                          </>
                        ) : (
                          <span style={{ fontSize: 12, color: PRIMARY, fontWeight: 700 }}>✦ Tier Tertinggi</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Syarat Naik Tier */}
      <Card padding="20px 24px">
        <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 16 }}>📈 Syarat Naik Tier</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
          <div style={{ background: "rgba(244, 190, 94, 0.05)", padding: "16px 18px", borderRadius: "10px 0 0 10px", borderRight: "2px solid #FFF" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: WARNING }}>🥉 Bronze</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: WARNING + "99", marginTop: 2 }}>0 - 499 poin</div>
            <div style={{ fontSize: 12, color: "#8181A5", marginTop: 8 }}>Gratis bergabung, dapatkan poin setiap pembelian</div>
          </div>
          <div style={{ background: "rgba(129, 129, 165, 0.05)", padding: "16px 18px", borderRight: "2px solid #FFF" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#8181A5" }}>🥈 Silver</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#8181A5" + "99", marginTop: 2 }}>500 - 999 poin</div>
            <div style={{ fontSize: 12, color: "#8181A5", marginTop: 8 }}>Diskon 5% untuk semua menu, prioritas antrian</div>
          </div>
          <div style={{ background: "rgba(94, 129, 244, 0.05)", padding: "16px 18px", borderRadius: "0 10px 10px 0" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: PRIMARY }}>🥇 Gold</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: PRIMARY + "99", marginTop: 2 }}>1000+ poin</div>
            <div style={{ fontSize: 12, color: "#8181A5", marginTop: 8 }}>Diskon 10%, akses promo eksklusif, gratis ongkir</div>
          </div>
        </div>
      </Card>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}