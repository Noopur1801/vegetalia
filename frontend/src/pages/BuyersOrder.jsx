import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { io } from 'socket.io-client';

export default function BuyerOrders() {
   const [orders, setOrders] = useState([]);
   const { token } = useContext(AuthContext);

   const fetchMyOrders = async () => {
      try {
         const res = await axios.get('http://localhost:5000/api/orders/my-orders', {
            headers: { Authorization: `Bearer ${token}` }
         });
         setOrders(res.data);
      } catch (err) { console.error(err); }
   };

   useEffect(() => {
      if (token) fetchMyOrders();
   }, [token]);

   useEffect(() => {
      const socket = io('http://localhost:5000');

      socket.on('orderStatusUpdated', (updatedOrder) => {
         setOrders(prevOrders =>
            prevOrders.map(order =>
               order._id === updatedOrder._id ? updatedOrder : order
            )
         );
      });

      return () => socket.disconnect();
   }, []);

   const submitRating = async (orderId) => {
      const vendorRating = document.getElementById(`vendor-rate-${orderId}`).value;
      const driverRating = document.getElementById(`driver-rate-${orderId}`).value;

      try {
         await axios.put(`http://localhost:5000/api/orders/${orderId}/rate`,
            { vendorRating: Number(vendorRating), driverRating: Number(driverRating) },
            { headers: { Authorization: `Bearer ${token}` } }
         );
         alert("Thanks for your review!");
         fetchMyOrders();
      } catch (err) {
         alert("Failed to submit rating.");
      }
   };

   // --- NEW: Helper function to display the correct badge ---
   const getDeliveryLabel = (type) => {
      if (type === 'Advance') return '🗓️ Scheduled (15 Days)';
      if (type === 'Tomorrow') return '📅 Deliver Tomorrow';
      return '⚡ Deliver Today'; // Default
   };

   return (
      <div className="dashboard-wrapper" style={{ maxWidth: '800px' }}>
         <div className="dashboard-card">
            <h1 className="heading-main">My Orders & Tracking (Live 🔴)</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {orders.length === 0 ? (
                  <p className="text-muted">You haven't placed any orders yet.</p>
               ) : (
                  orders.map(order => (
                     <div key={order._id} className="inner-card">

                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '12px' }}>
                           <div>
                              <span style={{ fontWeight: 'bold' }}>Order #{order._id.slice(-6).toUpperCase()}</span>
                              <span className="text-muted" style={{ marginLeft: '12px' }}>
                                 {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                           </div>
                           {/* Updated badge logic here */}
                           <span className={`badge ${order.deliveryType === 'Today' ? 'badge-today' : 'badge-scheduled'}`}>
                              {getDeliveryLabel(order.deliveryType)}
                           </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <div>{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</div>
                           <div style={{ fontWeight: 'bold', fontSize: '18px' }}>₹{order.totalAmount}</div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span className="text-muted" style={{ fontSize: '13px' }}>Status:</span>
                              <span className={`badge ${order.status === 'Pending' ? 'badge-pending' : 'badge-active'}`}>
                                 {order.status}
                              </span>
                           </div>

                           {order.driverId ? (
                              <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                 <span className="text-muted">Driver Assigned:</span>
                                 <span style={{ fontWeight: 'bold' }}>🚗 {order.driverId.name} (📱 {order.driverId.phone || 'No phone'})</span>
                              </div>
                           ) : (
                              <div className="text-muted" style={{ fontSize: '13px' }}>Waiting for driver...</div>
                           )}
                        </div>

                        {order.status === 'Delivered' && !order.vendorRating && (
                           <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f4fbf4', border: '1px solid #d1d5db', borderRadius: '8px' }}>
                              <p style={{ fontWeight: 'bold', marginBottom: '10px', color: '#1f2937' }}>Rate your experience:</p>

                              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                 <select id={`vendor-rate-${order._id}`} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}>
                                    <option value="5">Vendor: 5 Stars 🌟</option>
                                    <option value="4">Vendor: 4 Stars</option>
                                    <option value="3">Vendor: 3 Stars</option>
                                    <option value="2">Vendor: 2 Stars</option>
                                    <option value="1">Vendor: 1 Star</option>
                                 </select>

                                 <select id={`driver-rate-${order._id}`} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}>
                                    <option value="5">Driver: 5 Stars 🌟</option>
                                    <option value="4">Driver: 4 Stars</option>
                                    <option value="3">Driver: 3 Stars</option>
                                    <option value="2">Driver: 2 Stars</option>
                                    <option value="1">Driver: 1 Star</option>
                                 </select>
                              </div>

                              <button onClick={() => submitRating(order._id)} style={{ padding: '8px 16px', backgroundColor: '#488c52', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                                 Submit Review
                              </button>
                           </div>
                        )}

                     </div>
                  ))
               )}
            </div>
         </div>
      </div>
   );
}