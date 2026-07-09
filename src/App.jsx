// src/App.jsx - FULL VERSION (RAPIH!)
import "./index.css";
import { Route, Routes, Navigate } from "react-router-dom";
import React, { Suspense } from "react";
import AuthLayout from "./layouts/AuthLayout";
import LoadingSpinner from "./components/LoadingSpinner";
import AuthGuard from "./components/AuthGuard";

// ============================================================
// CUSTOMER GUARD
// ============================================================
function CustomerGuard({ children }) {
    const userData = localStorage.getItem("user");
    
    if (!userData) {
        return <Navigate to="/login" />;
    }

    try {
        const user = JSON.parse(userData);
        if (user.role !== "customer") {
            return <Navigate to="/dashboard" />;
        }
    } catch {
        return <Navigate to="/login" />;
    }

    return children;
}

// ============================================================
// LAZY IMPORT - SEMUA PAGES
// ============================================================

// Main Pages
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Customers = React.lazy(() => import("./pages/Customers"));
const CustomerDetail = React.lazy(() => import("./pages/CustomerDetail"));
const Orders = React.lazy(() => import("./pages/Orders"));
const Transactions = React.lazy(() => import("./pages/Transactions"));
const Loyalty = React.lazy(() => import("./pages/Loyalty"));
const Promos = React.lazy(() => import("./pages/Promos"));
const Reports = React.lazy(() => import("./pages/Reports"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Users = React.lazy(() => import("./pages/Users"));

// Customer Page
const CustomerDashboard = React.lazy(() => import("./pages/CustomerDashboard"));

// Auth Pages
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));

// Landing Page
const LandingPage = React.lazy(() => import("./pages/LandingPage"));

// Layouts
const MainLayout = React.lazy(() => import("./layouts/MainLayout"));

// ============================================================
// APP COMPONENT
// ============================================================
function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen text="Memuat Aplikasi..." />}>
      <Routes>
        {/* ========================================================== */}
        {/* ROUTE PUBLIK - TANPA LOGIN */}
        {/* ========================================================== */}
        <Route path="/" element={<LandingPage />} />

        {/* ========================================================== */}
        {/* ROUTE AUTH - LOGIN / REGISTER / FORGOT */}
        {/* ========================================================== */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>

        {/* ========================================================== */}
        {/* ROUTE ADMIN / STAFF - HARUS LOGIN */}
        {/* ========================================================== */}
        <Route
          element={
            <AuthGuard>
              <MainLayout />
            </AuthGuard>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/loyalty" element={<Loyalty />} />
          <Route path="/promos" element={<Promos />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/users" element={<Users />} />
        </Route>

        {/* ========================================================== */}
        {/* ROUTE CUSTOMER - HANYA ROLE CUSTOMER */}
        {/* ========================================================== */}
        <Route
          element={
            <CustomerGuard>
              <CustomerDashboard />
            </CustomerGuard>
          }
        >
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        </Route>

        {/* ========================================================== */}
        {/* ROUTE ERROR */}
        {/* ========================================================== */}
        <Route
          path="/error-400"
          element={
            <NotFound
              code="400"
              title="Bad Request"
              description="Permintaan tidak valid atau format salah."
            />
          }
        />
        <Route
          path="/error-401"
          element={
            <NotFound
              code="401"
              title="Unauthorized"
              description="Kamu harus login untuk mengakses halaman ini."
            />
          }
        />
        <Route
          path="/error-403"
          element={
            <NotFound
              code="403"
              title="Forbidden"
              description="Kamu tidak memiliki izin untuk mengakses halaman ini."
            />
          }
        />

        {/* ========================================================== */}
        {/* 404 NOT FOUND - HARUS PALING BAWAH */}
        {/* ========================================================== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;