import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutGrid, Package, PlusCircle, LogOut, ShieldCheck } from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/products", label: "Products", icon: Package },
  { to: "/products/add", label: "Add Product", icon: PlusCircle },
];

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 h-16 border-b border-gray-100">
        <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
          <ShieldCheck className="text-white" size={16} />
        </div>
        <span className="font-semibold text-gray-900">EWA Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
            {user?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition w-full px-3 py-2 rounded-lg hover:bg-red-50"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;