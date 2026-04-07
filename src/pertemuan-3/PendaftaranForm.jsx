import { useState } from "react";
import InputField from "./components/InputField";

export default function PendaftaranForm() {
  // State untuk menampung input
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    umur: "",
    kursus: "",
    level: "",
  });

  // State untuk error dan hasil submit
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  const validate = (name, value) => {
    let errorMsg = "";
    if (!value) {
      errorMsg = "Bidang ini wajib diisi!";
    } else {
      if (name === "nama") {
        if (value.length < 3) errorMsg = "Nama minimal 3 karakter.";
        else if (/\d/.test(value)) errorMsg = "Nama tidak boleh mengandung angka.";
      }
      if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
        errorMsg = "Format email tidak valid.";
      }
      if (name === "umur" && (value < 10 || value > 60)) {
        errorMsg = "Umur harus antara 10 - 60 tahun.";
      }
    }
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
    setSubmittedData(null);
  };

  const isFormValid = 
    Object.values(formData).every((val) => val !== "") &&
    Object.values(errors).every((err) => err === "");

  const handleSubmit = () => {
    if (isFormValid) {
      setSubmittedData(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-400 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Animations */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-lg border border-white/50 border-t-8 border-gradient-to-r from-purple-500 via-pink-500 to-orange-500">
        {/* Header dengan Gradient */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            <svg className="w-10 h-10 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h2 className="text-4xl font-black">Form Pendaftaran</h2>
          </div>
          <p className="text-gray-600 mt-2 font-medium">Mulai perjalanan belajarmu sekarang!</p>
        </div>

        {/* Input Reusable */}
        <InputField 
          label="Nama Lengkap" type="text" placeholder="Contoh: Suci Ramadhani"
          value={formData.nama} onChange={(e) => handleChange({target: {name: 'nama', value: e.target.value}})}
          error={errors.nama}
        />

        <InputField 
          label="Email" type="email" placeholder="email@contoh.com"
          value={formData.email} onChange={(e) => handleChange({target: {name: 'email', value: e.target.value}})}
          error={errors.email}
        />

        <InputField 
          label="Umur" type="number" placeholder="Masukkan umur"
          value={formData.umur} onChange={(e) => handleChange({target: {name: 'umur', value: e.target.value}})}
          error={errors.umur}
        />

        {/* Select Dropdowns dengan Glass Effect */}
        <div className="mb-5">
          <label className="block text-gray-800 font-semibold mb-2 text-lg">🎯 Pilih Program Kursus</label>
          <select 
            name="kursus" 
            onChange={handleChange} 
            className="w-full p-4 border-2 border-purple-200 bg-white/70 backdrop-blur-sm rounded-2xl text-lg font-medium shadow-lg hover:shadow-xl hover:border-purple-400 transition-all duration-300 focus:ring-4 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
          >
            <option value="" className="text-gray-400">✨ Pilih Kursus Impianmu</option>
            <option value="React Native" className="bg-gradient-to-r from-blue-50 to-purple-50">🚀 React Native</option>
            <option value="Backend Laravel" className="bg-gradient-to-r from-green-50 to-blue-50">⚙️ Backend Laravel</option>
            <option value="UI/UX Design" className="bg-gradient-to-r from-pink-50 to-orange-50">🎨 UI/UX Design</option>
          </select>
        </div>

        <div className="mb-8">
          <label className="block text-gray-800 font-semibold mb-2 text-lg">📊 Level Kemampuan</label>
          <select 
            name="level" 
            onChange={handleChange} 
            className="w-full p-4 border-2 border-pink-200 bg-white/70 backdrop-blur-sm rounded-2xl text-lg font-medium shadow-lg hover:shadow-xl hover:border-pink-400 transition-all duration-300 focus:ring-4 focus:ring-pink-200 focus:border-pink-500 focus:outline-none"
          >
            <option value="" className="text-gray-400">🌟 Pilih Levelmu</option>
            <option value="Beginner" className="bg-gradient-to-r from-green-50 to-blue-50">🥚 Beginner</option>
            <option value="Intermediate" className="bg-gradient-to-r from-yellow-50 to-orange-50">🦋 Intermediate</option>
          </select>
        </div>

        {/* Tombol dengan Gradient Magic */}
        {isFormValid ? (
          <button 
            onClick={handleSubmit}
            className="group relative w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white font-black py-5 px-6 rounded-2xl text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-500 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <span className="relative flex items-center justify-center">
              🚀 Daftar Sekarang & Mulai Belajar!
            </span>
          </button>
        ) : (
          <div className="group relative p-6 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-2 border-yellow-300/50 backdrop-blur-sm rounded-2xl text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-yellow-400/20 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-lg font-bold text-yellow-900">Lengkapi semua data dengan benar!</p>
              <p className="text-yellow-800 font-medium">Tombol daftar akan muncul otomatis ✨</p>
            </div>
          </div>
        )}
      </div>

      {/* Hasil Submit dengan Glassmorphism */}
      {submittedData && (
        <div className="mt-10 p-8 bg-white/80 backdrop-blur-xl border border-green-200/50 rounded-3xl shadow-2xl w-full max-w-lg border-l-8 border-l-green-500 animate-[bounce_0.6s_ease-in-out] hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg mr-4">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Pendaftaran Berhasil!</h3>
              <p className="text-green-700 font-semibold">Selamat datang di perjalanan belajarmu! 🎉</p>
            </div>
          </div>
          
          <div className="space-y-4 text-lg">
            <div className="flex items-center p-3 bg-green-50/50 rounded-xl border-l-4 border-green-400">
              <span className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center mr-4 font-bold text-green-800">👤</span>
              <div><strong>Nama:</strong> {submittedData.nama}</div>
            </div>
            <div className="flex items-center p-3 bg-green-50/50 rounded-xl border-l-4 border-green-400">
              <span className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center mr-4 font-bold text-blue-800">📧</span>
              <div><strong>Email:</strong> {submittedData.email}</div>
            </div>
            <div className="flex items-center p-3 bg-green-50/50 rounded-xl border-l-4 border-green-400">
              <span className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center mr-4 font-bold text-purple-800">🎓</span>
              <div><strong>Program:</strong> {submittedData.kursus} ({submittedData.level})</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-200/30 rounded-2xl text-center">
            <p className="text-green-800 font-bold text-lg">📬 Konfirmasi pendaftaran telah dikirim ke email anda!</p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-bounce-short {
          animation: bounce 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}