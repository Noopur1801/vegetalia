import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function VendorMyProducts() {
   const [products, setProducts] = useState([]);
   const { token } = useContext(AuthContext);

   useEffect(() => {
      const fetchMyProducts = async () => {
         try {
            const res = await axios.get(import.meta.env.VITE_API_URL + '/api/products/my-products', {
               headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(res.data);
         } catch (err) {
            console.error("Error fetching products:", err);
         }
      };
      if (token) fetchMyProducts();
   }, [token]);

   const markOutofStock = async (productId) => {
      try {
         await axios.put(`http://localhost:5000/api/products/${productId}`,
            { stock: 0 },
            { headers: { Authorization: `Bearer ${token}` } }
         );

         setProducts(products.map(p => p._id === productId ? { ...p, stock: 0 } : p));
      } catch (err) {
         console.error("Error updating stock:", err);
      }
   };

   const deleteProduct = async (productId) => {
      if (!window.confirm("Are you sure you want to delete this product?")) return;
      try {
         await axios.delete(`http://localhost:5000/api/products/${productId}`, {
            headers: { Authorization: `Bearer ${token}` }
         });
         setProducts(products.filter(p => p._id !== productId));
      } catch (err) {
         console.error("Error deleting product:", err);
      }
   };

   return (
      <div>
         <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', color: '#4b6043' }}>My Inventory</h2>

         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {products.length === 0 ? (
               <p>You haven't added any products yet.</p>
            ) : (
               products.map(product => (
                  <div key={product._id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #c7ddb5', opacity: product.stock === 0 ? 0.6 : 1, display: 'flex', flexDirection: 'column' }}>

                     {/* NEW: Product Image Container */}
                     <div style={{ width: '100%', height: '180px', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px', backgroundColor: '#f3f4f6' }}>
                        <img
                           src={product.imageUrl || 'https://placehold.co/400x300?text=No+Image'}
                           alt={product.name}
                           style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                     </div>

                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <h3 style={{ margin: 0, color: '#2b3f44' }}>{product.name}</h3>
                        <span style={{ backgroundColor: product.stock > 0 ? '#dcfce7' : '#fee2e2', color: product.stock > 0 ? '#166534' : '#991b1b', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                           {product.stock > 0 ? `${product.stock} kg in stock` : 'Out of Stock'}
                        </span>
                     </div>

                     <p style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold', color: '#4b6043' }}>₹{product.price} / kg</p>

                     {/* Pushes buttons to the bottom if image/text heights vary */}
                     <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                        {product.stock > 0 && (
                           <button
                              onClick={() => markOutofStock(product._id)}
                              style={{ flex: 1, backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                           >
                              Mark Out of Stock
                           </button>
                        )}
                        <button
                           onClick={() => deleteProduct(product._id)}
                           style={{ flex: product.stock === 0 ? 1 : 'none', backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                           Delete
                        </button>
                     </div>
                  </div>
               ))
            )}
         </div>
      </div>
   );
}