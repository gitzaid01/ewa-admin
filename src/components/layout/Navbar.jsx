import { Search, Bell, Settings } from "lucide-react";

const Navbar = () => {
  return (
    <header className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search products or orders..."
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
        />
      </div>
      <div className="flex items-center gap-4 text-gray-500">
        <button className="hover:text-gray-700">
          <Bell size={18} />
        </button>
        <button className="hover:text-gray-700">
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;