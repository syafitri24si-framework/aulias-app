import { FaHome, FaShoppingCart, FaUsers, FaGem, FaTags, FaChartLine } from "react-icons/fa";
import { NavLink } from "react-router-dom";


export default function Sidebar() {
    const menuClass = ({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300
        ${isActive
            ? "bg-amber-100 text-amber-800 font-semibold"
            : "text-gray-600 hover:bg-amber-50 hover:text-amber-700"
        }`;


    return (
        <div className="w-64 bg-white p-6 flex flex-col justify-between min-h-screen border-r">
            <div>
                <h1 className="text-3xl font-bold mb-1">
                    Rotte<span className="text-amber-800">.</span>
                </h1>
                <p className="text-gray-400 text-sm mb-8">Bakery CRM</p>


                <ul className="space-y-3">
                    <NavLink to="/" className={menuClass}><FaHome /> Dashboard</NavLink>
                    <NavLink to="/orders" className={menuClass}><FaShoppingCart /> Orders</NavLink>
                    <NavLink to="/customers" className={menuClass}><FaUsers /> Customers</NavLink>
                    <NavLink to="/loyalty" className={menuClass}><FaGem /> Loyalty</NavLink>
                    <NavLink to="/promos" className={menuClass}><FaTags /> Promos</NavLink>
                    <NavLink to="/reports" className={menuClass}><FaChartLine /> Reports</NavLink>
                </ul>
            </div>
            <div className="text-xs text-gray-400">© 2025 Rotte Bakery</div>
        </div>
    );
}

