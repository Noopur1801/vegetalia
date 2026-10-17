import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function DriverDeliveries() {
   const [orders, setOrders] = useState([]);
   const { token } = useContext(AuthContext);

   useEffect(() => {
      fetchPendingOrders();
   }, [token]);

   const fetchPendingOrders = async () => {
      try {
         const res = await axios.get(import.meta.env.VITE_API_URL + '/api/orders/pending', {
            headers: { Authorization: `Bearer ${token}` }
         });
         setOrders(res.data);
      } catch (err) { console.error(err); }
   };

   const acceptOrder = async (orderId) => {
      try {
         await axios.put(`import.meta.env.VITE_API_URL + '/api/orders/${orderId}/accept`, {}, {
            headers: { Authorization: `Bearer ${token}` }
         });
         alert("Delivery accepted! Time to hit the road.");
         fetchPendingOrders(); // Refresh the list so it disappears
      } catch (err) {
         alert("Failed to accept delivery");
      }
   };

   return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'Inter, sans-serif' }}>
         <h1 style={{ marginBottom: '24px' }}>Available Deliveries</h1>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.length === 0 ? (
               <p style={{ color: '#6b7280' }}>No pending deliveries right now. Grab a coffee!</p>
            ) : (
               orders.map(order => (
                  <div key={order._id} style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Delivery Value: ₹{order.totalAmount}</p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
                           Items: {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#9ca3af' }}>
                           Ordered: {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                     </div>
                     <button onClick={() => acceptOrder(order._id)} style={{ padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Accept Job
                     </button>
                  </div>
               ))
            )}
         </div>
      </div>
   );
}