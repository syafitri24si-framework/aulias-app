import "./index.css";
import { Route, Routes } from "react-router-dom"; // hapus Navigate
import React, { Suspense } from "react";
import AuthLayout from "./layouts/AuthLayout";
import Loading from "./components/Loading";

const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Customers = React.lazy(() => import("./pages/Customers"));
const Orders = React.lazy(() => import("./pages/Orders"));
const Loyalty = React.lazy(() => import("./pages/Loyalty"));
const Promos = React.lazy(() => import("./pages/Promos"));
const Reports = React.lazy(() => import("./pages/Reports"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));

const MainLayout = React.lazy(() => import("./layouts/MainLayout"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* LANGSUNG AKSES DASHBOARD TANPA LOGIN */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/loyalty" element={<Loyalty />} />
          <Route path="/promos" element={<Promos />} />
          <Route path="/reports" element={<Reports />} />
        </Route>

        {/* Halaman auth tetap bisa diakses */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>

        <Route path="/error-400" element={<NotFound code="400" title="Bad Request" description="Permintaan tidak valid atau format salah." />} />
        <Route path="/error-401" element={<NotFound code="401" title="Unauthorized" description="Kamu harus login untuk mengakses halaman ini." />} />
        <Route path="/error-403" element={<NotFound code="403" title="Forbidden" description="Kamu tidak memiliki izin untuk mengakses halaman ini." />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;