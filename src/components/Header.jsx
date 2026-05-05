
import { FaBell, FaSearch } from "react-icons/fa";
import { FcAreaChart } from "react-icons/fc";
import { SlSettings } from "react-icons/sl";
import { useState } from "react";


export default function Header() {
    const [openSearch, setOpenSearch] = useState(false);
    const [keyword, setKeyword] = useState("");


    return (
        <div className="flex justify-between items-center mb-6">
            <div
                className="relative w-80 cursor-pointer"
                onClick={() => setOpenSearch(true)}
            >
                <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
                <input
                    type="text"
                    placeholder="Search Here..."
                    className="w-full border px-4 py-2 rounded-lg pl-10 focus:outline-none pointer-events-none"
                />
            </div>


            <div className="flex items-center gap-6">
                <div className="relative">
                    <FaBell className="text-xl text-gray-600" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded">3</span>
                </div>
                <FcAreaChart className="text-xl" />
                <SlSettings className="text-xl text-gray-600" />
                <div className="flex items-center gap-2">
                    <span className="text-sm">Hello, <b>Admin Rotte</b></span>
                    <img src="/img/default-avatar.png" className="w-10 h-10 rounded-full" alt="profile" />
                </div>
            </div>


            {openSearch && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setOpenSearch(false)}>
                    <div className="bg-white p-6 rounded-2xl w-96 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-semibold mb-3">🔍 Search Menu</h2>
                        <input type="text" className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800" placeholder="Type something..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                        {keyword && <div className="mt-3 text-sm text-gray-600">Hasil pencarian: <b>{keyword}</b></div>}
                        <button className="mt-4 w-full bg-amber-800 text-white py-2 rounded-lg hover:bg-amber-900 transition" onClick={() => setOpenSearch(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}



