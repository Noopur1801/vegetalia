import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function VendorProducts() {
   const [products, setProducts] = useState([]);

   // 1. ADDED imageUrl TO STATE
   const [formData, setFormData] = useState({ name: '', category: 'Leafy', price: '', stock: '', unit: 'kg', imageUrl: '' });
   const { token } = useContext(AuthContext);

   useEffect(() => {
      fetchProducts();
   }, [token]);

   const fetchProducts = async () => {
      try {
         const res = await axios.get(import.meta.env.VITE_API_URL + '/api/products/my-products', { headers: { Authorization: `Bearer ${token}` } });
         setProducts(res.data);
      } catch (err) { console.error(err); }
   };

   const handleAddProduct = async (e) => {
      e.preventDefault();
      try {
         await axios.post(import.meta.env.VITE_API_URL + '/api/products', formData, { headers: { Authorization: `Bearer ${token}` } });
         fetchProducts();

         // 2. CLEAR imageUrl ON RESET
         setFormData({ name: '', category: 'Leafy', price: '', stock: '', unit: 'kg', imageUrl: '' });
      } catch (err) {
         alert(err.response?.data?.message || "Failed to add product.");
      }
   };

   const handleDelete = async (id) => {
      try {
         await axios.delete(`http://localhost:5000/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
         fetchProducts();
      } catch (err) { console.error(err); }
   };

   return (
      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', fontFamily: 'Inter, sans-serif' }}>
         <h1 style={{ marginBottom: '24px' }}>Inventory Management</h1>

         {/* Add Product Form */}
         <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', marginTop: 0, marginBottom: '16px' }}>Add New Vegetable</h2>
            <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
               <input type="text" placeholder="Product Name (e.g., Tomatoes)" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
               <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}>
                  <option value="Leafy">Leafy Greens</option>
                  <option value="Root">Root Vegetables</option>
                  <option value="Fruiting">Fruiting Vegetables</option>
                  <option value="Organic">Organic Specials</option>
               </select>
               <input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />

               <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="number" placeholder="Stock Quantity" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} required style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
                  <select value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} style={{ width: '80px', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}>
                     <option value="kg">kg</option>
                     <option value="bunch">bunch</option>
                     <option value="piece">piece</option>
                  </select>
               </div>

               {/* 3. ADDED IMAGE URL INPUT (Spans both columns) */}
               <input type="url" placeholder="Product Image URL (e.g., https://images.unsplash.com/photo-of-tomato)" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} required style={{ gridColumn: 'span 2', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />

               <button type="submit" style={{ gridColumn: 'span 2', padding: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Add to Inventory</button>
            </form>
         </div>

         {/* Product List */}
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
            {products.map(p => (
               <div key={p._id} style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>

                  {/* 4. RENDER THE IMAGE IN THE PRODUCT CARD */}
                  <img
                     src={p.imageUrl || 'https://via.placeholder.com/150?text=No+Image'}
                     alt={p.name}
                     style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '12px' }}
                  />

                  <h3 style={{ margin: '0 0 8px 0' }}>{p.name}</h3>
                  <div>
                     <span style={{ fontSize: '12px', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '12px' }}>{p.category}</span>
                  </div>
                  <p style={{ margin: '12px 0 4px 0', fontWeight: 'bold' }}>₹{p.price} / {p.unit}</p>
                  <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#6b7280' }}>Stock: {p.stock} {p.unit}</p>

                  {/* flexGrow keeps the delete button anchored to the bottom if image sizes differ */}
                  <div style={{ flexGrow: 1 }}></div>

                  <button onClick={() => handleDelete(p._id)} style={{ width: '100%', padding: '6px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '12px' }}>Delete</button>
               </div>
            ))}
         </div>
      </div>
   );
}