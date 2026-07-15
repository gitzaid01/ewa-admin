import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    setDeleteError("");
    setDeletingId(id);
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      setDeleteError(
        err.response?.data?.message || "Failed to delete product."
      );
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your product catalog
            </p>
          </div>
          <Link
            to="/products/add"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            <span className="text-lg leading-none">+</span> Add Product
          </Link>
        </div>

        {/* Search */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Global delete error */}
        {deleteError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {deleteError}
          </div>
        )}

        {/* Table card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-500 text-sm">
              Loading products...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-500 text-sm">
                {search
                  ? "No products match your search."
                  : "No products yet. Add your first one to get started."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <th className="px-4 py-3">Image</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Specifications</th>
                    <th className="px-4 py-3">Applications</th>
                    <th className="px-4 py-3">Featured</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          onError={(e) => {
                            e.target.src =
                              "https://placehold.co/48x48?text=No+Img";
                          }}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {p.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">
                        {p.specifications?.join(", ") || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">
                        {p.applications?.join(", ") || "—"}
                      </td>
                      <td className="px-4 py-3">
                        {p.isFeatured ? (
                          <span className="inline-flex items-center bg-emerald-100 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
                            Featured
                          </span>
                        ) : (
                          <span className="inline-flex items-center bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-full">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-3">
                          {confirmId === p._id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                Delete?
                              </span>
                              <button
                                onClick={() => handleDelete(p._id)}
                                disabled={deletingId === p._id}
                                className="text-xs font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-300 px-2.5 py-1 rounded-md transition-colors"
                              >
                                {deletingId === p._id ? "Deleting..." : "Yes"}
                              </button>
                              <button
                                onClick={() => setConfirmId(null)}
                                disabled={deletingId === p._id}
                                className="text-xs font-medium text-gray-600 hover:bg-gray-100 px-2.5 py-1 rounded-md transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              <Link
                                to={`/products/edit/${p._id}`}
                                className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => setConfirmId(p._id)}
                                className="text-red-600 hover:text-red-800 font-medium text-sm"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;