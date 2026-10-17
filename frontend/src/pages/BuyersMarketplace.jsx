import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext'; // 1. Imported your global cart!

export default function BuyerMarketplace() {
   const [products, setProducts] = useState([]);
   const { token } = useContext(AuthContext);
   const { addToCart } = useContext(CartContext); // 2. Connected to global context

   useEffect(() => {
      const fetchProducts = async () => {
         try {
            const res = await axios.get(import.meta.env.VITE_API_URL + '/api/products/all', {
               headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(res.data);
         } catch (err) { console.error(err); }
      };
      if (token) fetchProducts();
   }, [token]);

   // Helper to format the product so the global cart knows exactly what it is
   const handleAddToCart = (product) => {
      addToCart({
         ...product,
         productId: product._id // Ensures the CartContext can prevent duplicates
      });
      // Optional: A little popup so they know it worked since the sidebar is gone!
      // alert(`${product.name} added to cart!`); 
   };

   return (
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', fontFamily: 'Inter, sans-serif' }}>

         <h1 style={{ marginBottom: '24px' }}>Fresh Produce Market</h1>

         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {products.map(p => (
               <div key={p._id} style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>

                  <img
                     src={p.imageUrl || 'https://via.placeholder.com/150?text=No+Image'}
                     alt={p.name}
                     style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px', marginBottom: '12px' }}
                  />

                  <h3 style={{ margin: '0 0 4px 0' }}>{p.name}</h3>
                  <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#6b7280' }}>By: {p.businessName || 'Local Farm'}</p>

                  <div>
                     <span style={{ fontSize: '12px', backgroundColor: '#f4fbf4', color: '#3f824e', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                        {p.category}
                     </span>
                  </div>

                  {/* flexGrow pushes the price and button to the bottom so cards are equal height */}
                  <div style={{ flexGrow: 1 }}></div>

                  <p style={{ margin: '16px 0 8px 0', fontSize: '18px', fontWeight: 'bold' }}>₹{p.price} <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 'normal' }}>/ {p.unit}</span></p>

                  <button
                     onClick={() => handleAddToCart(p)}
                     style={{ width: '100%', padding: '10px', backgroundColor: '#488c52', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.2s' }}
                  >
                     Add to Cart
                  </button>
               </div>
            ))}
         </div>

         {products.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9fafb', borderRadius: '8px', color: '#6b7280' }}>
               No products available right now. Check back later!
            </div>
         )}

      </div>
   );
}