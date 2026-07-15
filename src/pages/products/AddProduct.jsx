import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [form, setForm] = useState({ name: "", price: "", category: "", description: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/products", form); // update when backend is ready
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div>
      <h2>Add Product</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
        <input name="name" placeholder="Product Name" onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" onChange={handleChange} required />
        <input name="category" placeholder="Category" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;