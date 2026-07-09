// src/services/supabase.js - FULL VERSION
import axios from 'axios'

// ============================================
// KONFIGURASI SUPABASE
// ============================================
const API_URL = "https://mnddhydtawungftggfdd.supabase.co/rest/v1"
const API_KEY = "sb_publishable_RyKL3yTV04oeVEeprjMVGA_PexGUflQ"

const headers = {
  apikey: API_KEY,
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
}

// ================================================================
// 🔵 USERS (untuk login & manajemen user)
// ================================================================
export const usersAPI = {
  async fetchAll() {
    const res = await axios.get(`${API_URL}/users`, { headers })
    return res.data
  },
  async create(data) {
    const res = await axios.post(`${API_URL}/users`, data, { headers })
    return res.data
  },
  async update(id, data) {
    const res = await axios.patch(`${API_URL}/users?id=eq.${id}`, data, { headers })
    return res.data
  },
  async delete(id) {
    const res = await axios.delete(`${API_URL}/users?id=eq.${id}`, { headers })
    return res.data
  },
  async login(email, password) {
    const res = await axios.get(
      `${API_URL}/users?email=ilike.${email}&password=eq.${password}`,
      { headers }
    )
    return res.data
  }
}

// ================================================================
// 🟢 CUSTOMERS (CRUD + Relasi)
// ================================================================
export const customersAPI = {
  // Ambil semua customer
  async fetchAll() {
    const res = await axios.get(`${API_URL}/customers?order=created_at.desc`, { headers })
    return res.data
  },

  // Ambil customer by ID
  async fetchById(id) {
    const res = await axios.get(`${API_URL}/customers?id_customer=eq.${id}`, { headers })
    return res.data[0] || null
  },

  // Ambil customer by No HP
  async fetchByPhone(phone) {
    const res = await axios.get(`${API_URL}/customers?no_handphone=eq.${phone}`, { headers })
    return res.data[0] || null
  },

  // Ambil customer + transaksinya (JOIN!)
  async fetchWithTransactions(id) {
    const res = await axios.get(
      `${API_URL}/customers?id_customer=eq.${id}&select=*,transactions(*)`,
      { headers }
    )
    return res.data[0] || null
  },

  // Ambil semua customer + total transaksi (untuk dashboard)
  async fetchAllWithStats() {
    const customers = await this.fetchAll()
    
    // Ambil semua transaksi
    const transRes = await axios.get(`${API_URL}/transactions`, { headers })
    const transactions = transRes.data || []
    
    // Hitung statistik per customer
    return customers.map(c => {
      const customerTrans = transactions.filter(t => t.id_customer === c.id_customer)
      return {
        ...c,
        totalOrders: customerTrans.length,
        totalRevenue: customerTrans.reduce((sum, t) => sum + t.total_belanja, 0),
        lastTransaction: customerTrans.length > 0 ? customerTrans[0].tanggal_transaksi : null
      }
    })
  },

  async create(data) {
    const res = await axios.post(`${API_URL}/customers`, data, { headers })
    return res.data
  },

  async update(id, data) {
    const res = await axios.patch(`${API_URL}/customers?id_customer=eq.${id}`, data, { headers })
    return res.data
  },

  async delete(id) {
    const res = await axios.delete(`${API_URL}/customers?id_customer=eq.${id}`, { headers })
    return res.data
  }
}

// ================================================================
// 🟡 TRANSACTIONS (CRUD + Relasi)
// ================================================================
export const transactionsAPI = {
  // Ambil semua transaksi + data customer (JOIN!)
  async fetchAllWithCustomer() {
    const res = await axios.get(
      `${API_URL}/transactions?select=*,customers(nama_lengkap,no_handphone,loyalty_tier)&order=tanggal_transaksi.desc`,
      { headers }
    )
    return res.data
  },

  // Ambil semua transaksi
  async fetchAll() {
    const res = await axios.get(`${API_URL}/transactions?order=tanggal_transaksi.desc`, { headers })
    return res.data
  },

  // Ambil transaksi by customer ID
  async fetchByCustomer(customerId) {
    const res = await axios.get(
      `${API_URL}/transactions?id_customer=eq.${customerId}&order=tanggal_transaksi.desc`,
      { headers }
    )
    return res.data
  },

  // Ambil statistik transaksi (untuk dashboard)
  async fetchStats() {
    const transactions = await this.fetchAll()
    
    const total = transactions.length
    const completed = transactions.filter(t => t.status === 'Completed').length
    const pending = transactions.filter(t => t.status === 'Pending').length
    const cancelled = transactions.filter(t => t.status === 'Cancelled').length
    const revenue = transactions.reduce((sum, t) => sum + t.total_belanja, 0)
    
    // Top produk
    const productCount = {}
    transactions.forEach(t => {
      const products = t.nama_produk?.split(',').map(p => p.trim()) || []
      products.forEach(p => {
        productCount[p] = (productCount[p] || 0) + 1
      })
    })
    const topProducts = Object.entries(productCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      total,
      completed,
      pending,
      cancelled,
      revenue,
      topProducts
    }
  },

  async create(data) {
    const res = await axios.post(`${API_URL}/transactions`, data, { headers })
    return res.data
  },

  async update(id, data) {
    const res = await axios.patch(`${API_URL}/transactions?id_transaksi=eq.${id}`, data, { headers })
    return res.data
  },

  async delete(id) {
    const res = await axios.delete(`${API_URL}/transactions?id_transaksi=eq.${id}`, { headers })
    return res.data
  }
}

// src/services/supabase.js - BAGIAN PROMOS

// ================================================================
// 🟣 PROMOS (CRUD + Relasi)
// ================================================================
export const promosAPI = {
  // Ambil semua promo
  async fetchAll() {
    try {
      const res = await axios.get(`${API_URL}/promos?order=created_at.desc`, { headers })
      return res.data
    } catch (err) {
      console.error("Error fetching promos:", err)
      return []
    }
  },

  // Ambil promo yang aktif
  async fetchActive() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await axios.get(
        `${API_URL}/promos?active=eq.true&valid_until=gte.${today}&order=created_at.desc`,
        { headers }
      )
      return res.data
    } catch (err) {
      console.error("Error fetching active promos:", err)
      return []
    }
  },

  async create(data) {
    try {
      const payload = {
        ...data,
        type: data.type || 'Diskon',
        active: true
      };
      const res = await axios.post(`${API_URL}/promos`, payload, { headers })
      return res.data
    } catch (err) {
      console.error("Error creating promo:", err)
      throw err
    }
  },

  async update(id, data) {
    try {
      const res = await axios.patch(`${API_URL}/promos?id=eq.${id}`, data, { headers })
      return res.data
    } catch (err) {
      console.error("Error updating promo:", err)
      throw err
    }
  },

  async delete(id) {
    try {
      const res = await axios.delete(`${API_URL}/promos?id=eq.${id}`, { headers })
      return res.data
    } catch (err) {
      console.error("Error deleting promo:", err)
      throw err
    }
  },

  async toggleActive(id, currentActive) {
    try {
      const res = await axios.patch(
        `${API_URL}/promos?id=eq.${id}`,
        { active: !currentActive },
        { headers }
      )
      return res.data
    } catch (err) {
      console.error("Error toggling promo:", err)
      throw err
    }
  }
}