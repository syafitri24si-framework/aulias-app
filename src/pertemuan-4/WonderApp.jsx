import { useState } from "react";
import wonderData from "./wonders.json";
import WonderGuest from "./WonderGuest";
import WonderAdmin from "./WonderAdmin";

export default function WonderApp() {
  const [view, setView] = useState("guest");
  const [filter, setFilter] = useState({
    search: "",
    category: "",
    continent: "",
  });

  const handleInput = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const filteredData = wonderData.filter((w) => {
    const matchesSearch = w.name.toLowerCase().includes(filter.search.toLowerCase());
    const matchesCategory = filter.category ? w.category === filter.category : true;
    const matchesContinent = filter.continent
      ? w.location.continent === filter.continent
      : true;

    return matchesSearch && matchesCategory && matchesContinent;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-serif bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
              🌍 Wonder<span className="font-bold">Explorer</span>
            </h1>
            <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">
              Discover the world’s greatest wonders
            </p>
          </div>

          {/* SWITCH */}
          <div className="flex bg-white p-1.5 rounded-xl shadow border">
            <button
              onClick={() => setView("guest")}
              className={`px-6 py-2 rounded-lg transition ${
                view === "guest"
                  ? "bg-gradient-to-r from-indigo-500 to-emerald-500 text-white shadow"
                  : "text-slate-400 hover:bg-slate-100"
              }`}
            >
              Guest
            </button>

            <button
              onClick={() => setView("admin")}
              className={`px-6 py-2 rounded-lg transition ${
                view === "admin"
                  ? "bg-gradient-to-r from-indigo-500 to-emerald-500 text-white shadow"
                  : "text-slate-400 hover:bg-slate-100"
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* FILTER */}
        <div className="bg-white/80 backdrop-blur p-5 rounded-2xl shadow border mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="search"
            placeholder="Search wonders..."
            onChange={handleInput}
            className="p-3 rounded-xl border focus:ring-2 focus:ring-indigo-200 outline-none"
          />

          <select
            name="category"
            onChange={handleInput}
            className="p-3 rounded-xl border"
          >
            <option value="">All Category</option>
            <option>Historical</option>
            <option>Modern</option>
            <option>Natural</option>
            <option>Ancient</option>
          </select>

          <select
            name="continent"
            onChange={handleInput}
            className="p-3 rounded-xl border"
          >
            <option value="">All Continent</option>
            <option>Asia</option>
            <option>Europe</option>
            <option>Africa</option>
            <option>North America</option>
            <option>South America</option>
            <option>Australia</option>
          </select>
        </div>

        {/* CONTENT */}
        {view === "guest" ? (
          <WonderGuest data={filteredData} />
        ) : (
          <WonderAdmin data={filteredData} />
        )}
      </div>
    </div>
  );
}