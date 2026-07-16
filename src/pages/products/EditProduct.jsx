import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, useParams, Link } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    image: "",
    specifications: "",
    applications: "",
    isFeatured: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const p = res.data.product || res.data;
        setForm({
          name: p.name || "",
          category: p.category || "",
          description: p.description || "",
          // image is stored as an array in the DB — join into a
          // comma-separated string for the form input
          image: Array.isArray(p.image) ? p.image.join(", ") : p.image || "",
          specifications: (p.specifications || []).join(", "),
          applications: (p.applications || []).join(", "),
          isFeatured: !!p.isFeatured,
        });
      } catch (err) {
        console.error(err);
        setLoadError("Failed to load product. It may have been removed.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  // Splits a comma-separated string into a clean array of URLs
  const parseImageList = (value) =>
    String(value || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const validate = () => {
    const next = {};
    const name = String(form.name || "");
    const category = String(form.category || "");
    const description = String(form.description || "");
    const specifications = String(form.specifications || "");
    const applications = String(form.applications || "");
    const imageList = parseImageList(form.image);

    if (!name.trim()) next.name = "Product name is required.";
    else if (name.trim().length < 3)
      next.name = "Name must be at least 3 characters.";

    if (!category.trim()) next.category = "Category is required.";

    if (!description.trim())
      next.description = "Description is required.";
    else if (description.trim().length < 10)
      next.description = "Description must be at least 10 characters.";

    if (imageList.length === 0)
      next.image = "Add at least one image URL.";
    else if (!imageList.every((url) => /^https?:\/\/.+/.test(url)))
      next.image =
        "Each image must be a valid URL starting with http:// or https://";

    if (!specifications.trim())
      next.specifications = "Add at least one specification.";

    if (!applications.trim())
      next.applications = "Add at least one application.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        ...form,
        image: parseImageList(form.image),
        specifications: String(form.specifications || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        applications: String(form.applications || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      await api.put(`/products/${id}`, payload);
      navigate("/products");
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (field) =>
    `w-full border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 transition-colors ${
      errors[field]
        ? "border-red-300 focus:ring-red-200 focus:border-red-400"
        : "border-gray-300 focus:ring-indigo-200 focus:border-indigo-400"
    }`;

  const imagePreviewList = parseImageList(form.image);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center max-w-sm">
          <p className="text-red-600 text-sm font-medium mb-3">{loadError}</p>
          <Link
            to="/products"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            to="/products"
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
          >
            ← Back to Products
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-500 mt-1">
            Update the details for {form.name || "this product"}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {submitError && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                placeholder="e.g. Pump Parts Assembly"
                value={form.name}
                onChange={handleChange}
                className={inputClass("name")}
              />
              {errors.name ? (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              ) : (
                <p className="text-gray-400 text-xs mt-1">
                  The URL slug will be regenerated automatically from this name.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                name="category"
                placeholder="e.g. Pump Parts"
                value={form.category}
                onChange={handleChange}
                className={inputClass("category")}
              />
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Briefly describe the product, its use case, and materials..."
                value={form.description}
                onChange={handleChange}
                className={inputClass("description")}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Image URLs <span className="text-red-500">*</span>
              </label>
              <input
                name="image"
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                value={form.image}
                onChange={handleChange}
                className={inputClass("image")}
              />
              {errors.image ? (
                <p className="text-red-500 text-xs mt-1">{errors.image}</p>
              ) : (
                <p className="text-gray-400 text-xs mt-1">
                  Separate multiple image URLs with commas.
                </p>
              )}
              {imagePreviewList.length > 0 && !errors.image && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {imagePreviewList.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Preview ${idx + 1}`}
                      onError={(e) => (e.target.style.display = "none")}
                      onLoad={(e) => (e.target.style.display = "block")}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Specifications <span className="text-red-500">*</span>
              </label>
              <input
                name="specifications"
                placeholder="e.g. Carbon Steel, Length 5m, Anti Rust Coating"
                value={form.specifications}
                onChange={handleChange}
                className={inputClass("specifications")}
              />
              {errors.specifications ? (
                <p className="text-red-500 text-xs mt-1">
                  {errors.specifications}
                </p>
              ) : (
                <p className="text-gray-400 text-xs mt-1">
                  Separate multiple specifications with commas.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Applications <span className="text-red-500">*</span>
              </label>
              <input
                name="applications"
                placeholder="e.g. Water Management, Oil & Gas"
                value={form.applications}
                onChange={handleChange}
                className={inputClass("applications")}
              />
              {errors.applications ? (
                <p className="text-red-500 text-xs mt-1">
                  {errors.applications}
                </p>
              ) : (
                <p className="text-gray-400 text-xs mt-1">
                  Separate multiple applications with commas.
                </p>
              )}
            </div>

            <label className="flex items-center gap-2.5 pt-1 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">
                Mark as featured product
              </span>
            </label>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <Link
                to="/products"
                className="flex-1 text-center border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium py-2.5 rounded-lg transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;