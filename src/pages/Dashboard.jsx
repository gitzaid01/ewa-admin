import { useAuth } from "../context/AuthContext";
import { Users, Mail, Activity, ArrowUpRight } from "lucide-react";

const stats = [
  { label: "Total Products", value: "128", sub: "+8 this month", icon: Users, subColor: "text-emerald-600" },
  { label: "Pending Orders", value: "14", sub: "Needs attention", icon: Mail, subColor: "text-amber-600" },
  { label: "System Status", value: "Active", sub: "● Operational", icon: Activity, subColor: "text-emerald-600" },
];

const logs = [
  { title: "New Product Added", meta: "Wireless Mouse • 2 mins ago", color: "bg-indigo-500" },
  { title: "Order Fulfilled", meta: "Order #1042 • 1 hour ago", color: "bg-gray-400" },
  { title: "Failed Login Attempt", meta: "IP: 192.168.1.1 • 3 hours ago", color: "bg-red-500" },
  { title: "Backup Successful", meta: "Daily Vault • 5 hours ago", color: "bg-indigo-500" },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {user?.name || "Admin"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here's an overview of your store's activity.
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1.5">
          + New Product
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map(({ label, value, sub, icon: Icon, subColor }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Icon size={16} className="text-indigo-600" />
              </div>
              <span className={`text-xs font-medium ${subColor}`}>{sub}</span>
            </div>
            <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Chart + logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Sales Performance</h2>
            <span className="text-xs text-indigo-600 font-medium">Last 7 Days</span>
          </div>
          <div className="h-56 flex items-end gap-3">
            {[40, 65, 50, 80, 60, 90, 70].map((h, i) => (
              <div key={i} className="flex-1 bg-indigo-100 hover:bg-indigo-200 transition rounded-t-md" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Logs</h2>
          <div className="space-y-4">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-3">
                <div className={`w-1 rounded-full ${log.color}`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{log.title}</p>
                  <p className="text-xs text-gray-500">{log.meta}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm font-medium text-indigo-600 border border-indigo-100 rounded-lg py-2 hover:bg-indigo-50 flex items-center justify-center gap-1">
            View Audit Log <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;