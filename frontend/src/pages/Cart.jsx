import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
   // 🛡️ CRASH-PROOF FIX: If context fails to load, default to an empty array
   const { cart = [], clearCart } = useContext(CartContext) || {};
   const { token } = useContext(AuthContext);
   const navigate = useNavigate();
   const [loading, setLoading] = useState(false);

   // Calculate the total price safely
   const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

   const handleCheckout = async () => {
      if (cart.length === 0) return alert("Your cart is empty!");
      setLoading(true);

      try {
         await axios.post('http://localhost:5000/api/orders', {
            items: cart,
            totalAmount: totalAmount,
            deliveryType: 'Today'
         }, {
            headers: { Authorization: `Bearer ${token}` }
         });

         alert("Order placed successfully!");
         if (clearCart) clearCart();
         navigate('/buyer/orders');
      } catch (err) {
         alert("Checkout failed: " + (err.response?.data?.message || err.message));
      } finally {
         setLoading(false);
      }
   };

   return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'Inter, sans-serif' }}>
         <h1 style={{ marginBottom: '24px', color: '#1f2937' }}>🛒 Your Shopping Cart</h1>

         {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
               {/* 📝 UPDATED TEXT HERE */}
               <p style={{ color: '#6b7280', fontSize: '18px', fontWeight: 'bold' }}>
                  Your cart is empty. Add orders to buy!
               </p>
               <button onClick={() => navigate('/buyer/marketplace')} style={{ marginTop: '16px', padding: '10px 20px', backgroundColor: '#488c52', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Go to Marketplace
               </button>
            </div>
         ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {cart.map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '12px', backgroundColor: 'white' }}>
                     <div>
                        <h3 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>{item.name}</h3>
                        <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Vendor: {item.vendorName || 'Local Vendor'}</p>
                     </div>
                     <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>₹{item.price} x {item.quantity}</p>
                        <p style={{ margin: 0, color: '#488c52', fontWeight: 'bold' }}>Total: ₹{item.price * item.quantity}</p>
                     </div>
                  </div>
               ))}

               <div style={{ marginTop: '20px', padding: '24px', backgroundColor: '#f4fbf4', borderRadius: '12px', border: '1px solid #d1d5db', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                     <p style={{ margin: '0 0 4px 0', color: '#6b7280' }}>Total Amount</p>
                     <h2 style={{ margin: 0, color: '#1f2937', fontSize: '28px' }}>₹{totalAmount}</h2>
                  </div>

                  <button
                     onClick={handleCheckout}
                     disabled={loading}
                     style={{ padding: '14px 28px', backgroundColor: loading ? '#9ca3af' : '#488c52', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px' }}
                  >
                     {loading ? 'Processing...' : 'Place Order'}
                  </button>
               </div>
            </div>
         )}
      </div>
   );
}