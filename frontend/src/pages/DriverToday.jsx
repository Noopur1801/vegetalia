import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { io } from 'socket.io-client';

export default function DeliveriesToday() {
   const [deliveries, setDeliveries] = useState([]);
   const { token } = useContext(AuthContext);

   const fetchDeliveries = async () => {
      try {
         // Using your actual backend route for driver orders
         const res = await axios.get(import.meta.env.VITE_API_URL + '/api/orders/driver/active', {
            headers: { Authorization: `Bearer ${token}` }
         });

         // Filter to only show "Today" orders for this specific tab
         const todayOrders = res.data.filter(order => order.deliveryType === 'Today' || !order.deliveryType);
         setDeliveries(todayOrders);
      } catch (err) {
         console.error("Error fetching deliveries:", err);
      }
   };

   useEffect(() => {
      if (token) fetchDeliveries();
   }, [token]);

   // Real-time Socket.io updates
   useEffect(() => {
      const socket = io(import.meta.env.VITE_API_URL + '');

      socket.on('newOrder', () => { fetchDeliveries(); });
      socket.on('orderStatusUpdated', () => { fetchDeliveries(); });

      return () => socket.disconnect();
   }, [token]);

   // Action: Accept a pending order
   const acceptOrder = async (id) => {
      try {
         await axios.put(`import.meta.env.VITE_API_URL + '/api/orders/${id}/accept`, {}, {
            headers: { Authorization: `Bearer ${token}` }
         });
         fetchDeliveries();
      } catch (err) {
         console.error("Failed to accept", err);
      }
   };

   // Action: Update status (Accepted -> In Transit -> Delivered)
   const updateStatus = async (id, currentStatus) => {
      let nextStatus = currentStatus === "Accepted" ? "In Transit" : "Delivered";
      try {
         await axios.put(`import.meta.env.VITE_API_URL + '/api/orders/${id}/status`,
            { status: nextStatus },
            { headers: { Authorization: `Bearer ${token}` } }
         );
         fetchDeliveries();
      } catch (err) {
         console.error("Failed to update status", err);
      }
   };

   return (
      <div>
         <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', color: '#4b6043' }}>Deliveries for Today</h2>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {deliveries.length === 0 ? (
               <p style={{ textAlign: 'center', color: '#658354' }}>No deliveries scheduled for today.</p>
            ) : (
               deliveries.map(delivery => {
                  // Safely extract vendor info from the first item in the items array
                  const vendorInfo = delivery.items[0]?.vendorId || {};
                  const buyerInfo = delivery.buyerId || {};

                  return (
                     <div key={delivery._id} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #c7ddb5' }}>

                        <div style={{ flex: '1 1 300px', minWidth: '300px' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                              <h3 style={{ margin: 0, color: '#4b6043', fontSize: '18px' }}>#{delivery._id.slice(-6).toUpperCase()}</h3>
                              <span style={{ fontSize: '14px', color: '#6b7280' }}>{delivery.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</span>
                           </div>

                           <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                 <span style={{ color: '#87ab69', fontWeight: 'bold' }}>↑</span>
                                 <p style={{ margin: 0, fontSize: '14px', color: '#374151' }}>
                                    <strong>Pickup:</strong> {vendorInfo.businessName || 'Vendor'} ({vendorInfo.address || 'Store'})
                                 </p>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                 <span style={{ color: '#ef4444', fontWeight: 'bold' }}>↓</span>
                                 <p style={{ margin: 0, fontSize: '14px', color: '#374151' }}>
                                    <strong>Dropoff:</strong> {buyerInfo.name || 'Customer'} ({buyerInfo.address || 'Shipping Address'})
                                 </p>
                              </div>
                           </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', minWidth: '150px' }}>
                           <p style={{ margin: 0, fontWeight: 'bold', color: '#166534', fontSize: '18px' }}>₹{delivery.driverFee || 40}</p>

                           <span style={{
                              backgroundColor: delivery.status === "Delivered" ? '#dcfce7' : delivery.status === "In Transit" ? '#fef08a' : delivery.status === "Accepted" ? '#e0e7ff' : '#f3f4f6',
                              color: delivery.status === "Delivered" ? '#166534' : delivery.status === "In Transit" ? '#854d0e' : delivery.status === "Accepted" ? '#3730a3' : '#374151',
                              padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold'
                           }}>
                              {delivery.status}
                           </span>

                           {delivery.status === "Pending" && (
                              <button
                                 onClick={() => acceptOrder(delivery._id)}
                                 style={{ padding: '8px 16px', backgroundColor: '#4b6043', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
                              >
                                 Accept Route
                              </button>
                           )}

                           {delivery.status === "Accepted" && (
                              <button
                                 onClick={() => updateStatus(delivery._id, delivery.status)}
                                 style={{ padding: '8px 16px', backgroundColor: '#eab308', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
                              >
                                 Confirm Pickup
                              </button>
                           )}

                           {delivery.status === "In Transit" && (
                              <button
                                 onClick={() => updateStatus(delivery._id, delivery.status)}
                                 style={{ padding: '8px 16px', backgroundColor: '#87ab69', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
                              >
                                 Mark Delivered
                              </button>
                           )}
                        </div>

                     </div>
                  );
               })
            )}
         </div>
      </div>
   );
}