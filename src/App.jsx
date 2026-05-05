import "./tailwind.css";
import { Route, Routes } from "react-router-dom";
import React, { Suspense } from "react";
import AuthLayout from "./layouts/AuthLayout";
import Loading from "./components/Loading";


// Lazy load halaman utama
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Customers = React.lazy(() => import("./pages/Customers"));
const Orders = React.lazy(() => import("./pages/Orders"));
const Loyalty = React.lazy(() => import("./pages/Loyalty"));
const Promos = React.lazy(() => import("./pages/Promos"));
const Reports = React.lazy(() => import("./pages/Reports"));
const NotFound = React.lazy(() => import("./pages/NotFound"));


// Lazy load halaman auth
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));


// Layout utama (dengan sidebar & header)
const MainLayout = React.lazy(() => import("./layouts/MainLayout"));


function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Rute dengan MainLayout (halaman utama setelah login) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/loyalty" element={<Loyalty />} />
          <Route path="/promos" element={<Promos />} />
          <Route path="/reports" element={<Reports />} />
        </Route>


        {/* Rute dengan AuthLayout (halaman login/register/forgot) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>


        {/* Rute error (400, 401, 403, 404) reuse komponen NotFound */}
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
        {/* 404 untuk rute yang tidak dikenal */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}


export default App;

