import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

export default function AuthGuard({ children }) {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Cek apakah user sudah login (ada data di localStorage)
    const user = localStorage.getItem("user");
    
    if (!user) {
      // Jika belum login, redirect ke halaman login
      navigate("/login");
    } else {
      // Jika sudah login, cek apakah data user valid
      try {
        const userData = JSON.parse(user);
        if (!userData.email) {
          // Jika data tidak valid, hapus dan redirect ke login
          localStorage.removeItem("user");
          navigate("/login");
        }
      } catch (error) {
        // Jika data corrupt, hapus dan redirect ke login
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
    
    setIsChecking(false);
  }, [navigate]);

  // Tampilkan loading saat sedang mengecek auth
  if (isChecking) {
    return <LoadingSpinner fullScreen text="Memeriksa sesi..." />;
  }

  // Jika sudah login, tampilkan children
  return children;
}