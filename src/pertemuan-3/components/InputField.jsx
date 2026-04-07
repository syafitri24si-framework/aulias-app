export default function InputField({ label, type, placeholder, value, onChange, error }) {
  return (
    <div className="mb-4 text-left">
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${
          error ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-500"
        }`}
      />
      {/* Alert Error tampil di bawah input (Kriteria Tugas) */}
      {error && <p className="text-red-500 text-xs mt-1 italic font-medium">{error}</p>}
    </div>
  );
}