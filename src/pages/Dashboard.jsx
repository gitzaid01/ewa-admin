import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Package, Star, Tag, ArrowUpRight } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data.products || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const totalProducts = products.length;
  const featuredCount = products.filter((p) => p.isFeatured).length;
  const categoryCount = new Set(products.map((p) => p.category)).size;

  const stats = [
    {
      label: "Total Products",
      value: totalProducts,
      sub: `${categoryCount} ${categoryCount === 1 ? "category" : "categories"}`,
      icon: Package,
      subColor: "text-gray-500",
    },
    {
      label: "Featured Products",
      value: featuredCount,
      sub: totalProducts
        ? `${Math.round((featuredCount / totalProducts) * 100)}% of catalog`
        : "—",
      icon: Star,
      subColor: "text-emerald-600",
    },
    {
      label: "Categories",
      value: categoryCount,
      sub: "Active categories",
      icon: Tag,
      subColor: "text-indigo-600",
    },
  ];

  // Category breakdown, derived from real product data
  const categoryBreakdown = Object.entries(
    products.reduce((acc, p) => {
      if (p.category) acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const maxCategoryCount = Math.max(...categoryBreakdown.map(([, c]) => c), 1);

  // Most recently added products, real data sorted by createdAt
  const recentProducts = [...products]
    .filter((p) => p.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const timeAgo = (dateStr) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

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
        <button
          onClick={() => navigate("/products/add")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1.5"
        >
          + New Product
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map(({ label, value, sub, icon: Icon, subColor }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Icon size={16} className="text-indigo-600" />
              </div>
              <span className={`text-xs font-medium ${subColor}`}>{sub}</span>
            </div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              {label}
            </p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Category breakdown + recent products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Products by Category
            </h2>
          </div>
          {categoryBreakdown.length === 0 ? (
            <p className="text-sm text-gray-400 py-10 text-center">
              No products yet — add one to see category breakdown.
            </p>
          ) : (
            <div className="space-y-3">
              {categoryBreakdown.map(([category, count]) => (
                <div key={category}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">
                      {category}
                    </span>
                    <span className="text-gray-500">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{
                        width: `${(count / maxCategoryCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Recently Added
          </h2>
          {recentProducts.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">
              No products added yet.
            </p>
          ) : (
            <div className="space-y-4">
              {recentProducts.map((p) => (
                <div key={p._id} className="flex gap-3">
                  <div
                    className={`w-1 rounded-full ${
                      p.isFeatured ? "bg-emerald-500" : "bg-indigo-500"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {p.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {p.category} • {timeAgo(p.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => navigate("/products")}
            className="w-full mt-4 text-sm font-medium text-indigo-600 border border-indigo-100 rounded-lg py-2 hover:bg-indigo-50 flex items-center justify-center gap-1"
          >
            View All Products <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;