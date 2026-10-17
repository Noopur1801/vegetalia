import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { io } from 'socket.io-client';

export default function DriverAhead() {
   const [deliveries, setDeliveries] = useState([]);
   const { token } = useContext(AuthContext);

   const fetchAheadDeliveries = async () => {
      try {
         // Fetches active/available orders from your backend[cite: 8]
         const res = await axios.get(import.meta.env.VITE_API_URL + '/api/orders/driver/active', {
            headers: { Authorization: `Bearer ${token}` }
         });

         // Filter for advance or 15-day scheduled orders
         const aheadOrders = res.data.filter(order =>
            order.deliveryType === 'Advance' ||
            order.deliveryType === '15_days' ||
            order.deliveryType === 'Tomorrow'
         );
         setDeliveries(aheadOrders);
      } catch (err) {
         console.error("Error fetching ahead deliveries:", err);
      }
   };

   useEffect(() => {
      if (token) fetchAheadDeliveries();
   }, [token]);

   // Real-time Socket.io updates
   useEffect(() => {
      const socket = io(import.meta.env.VITE_API_URL + '');

      socket.on('newOrder', () => { fetchAheadDeliveries(); });
      socket.on('orderStatusUpdated', () => { fetchAheadDeliveries(); });

      return () => socket.disconnect();
   }, [token]);

   const acceptDelivery = async (id) => {
      try {
         await axios.put(`import.meta.env.VITE_API_URL + '/api/orders/${id}/accept`, {}, {
            headers: { Authorization: `Bearer ${token}` }
         });
         alert("Scheduled route accepted successfully!");
         fetchAheadDeliveries();
      } catch (err) {
         alert("Failed to accept delivery route.");
      }
   };

   return (
      <div>
         <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', color: '#4b6043' }}>Upcoming Deliveries (Schedule Ahead)</h2>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {deliveries.length === 0 ? (
               <p style={{ textAlign: 'center', color: '#658354', padding: '40px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #c7ddb5' }}>
                  No upcoming advance bookings scheduled right now.
               </p>
            ) : (
               deliveries.map(delivery => {
                  const vendorInfo = delivery.items[0]?.vendorId || {};
                  const buyerInfo = delivery.buyerId || {};
                  const isAccepted = delivery.status !== 'Pending';

                  return (
                     <div key={delivery._id} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #c7ddb5' }}>

                        {/* Delivery Details */}
                        <div style={{ flex: '1 1 300px', minWidth: '300px' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                              <h3 style={{ margin: 0, color: '#4b6043', fontSize: '18px' }}>
                                 {new Date(delivery.createdAt).toLocaleDateString()}
                              </h3>
                              <span style={{ backgroundColor: '#ddead1', color: '#4b6043', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                                 {delivery.deliveryType} Slot
                              </span>
                              <span style={{ color: '#658354', fontSize: '14px', fontWeight: 'bold' }}>• #{delivery._id.slice(-6).toUpperCase()}</span>
                           </div>

                           <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                 <span style={{ color: '#87ab69', fontWeight: 'bold' }}>↑</span>
                                 <p style={{ margin: 0, fontSize: '14px', color: '#374151' }}><strong>Pickup:</strong> {vendorInfo.businessName || 'Vendor'} ({vendorInfo.address || 'Store'})</p>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                 <span style={{ color: '#ef4444', fontWeight: 'bold' }}>↓</span>
                                 <p style={{ margin: 0, fontSize: '14px', color: '#374151' }}><strong>Dropoff:</strong> {buyerInfo.name || 'Customer'} ({buyerInfo.address || 'Shipping Address'})</p>
                              </div>
                           </div>
                        </div>

                        {/* Action Area */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', minWidth: '150px' }}>
                           <p style={{ margin: 0, fontWeight: 'bold', color: '#166534', fontSize: '18px' }}>₹{delivery.driverFee || 50}</p>

                           {isAccepted ? (
                              <span style={{
                                 backgroundColor: '#dcfce7',
                                 color: '#166534',
                                 padding: '8px 16px',
                                 borderRadius: '6px',
                                 fontSize: '14px',
                                 fontWeight: 'bold',
                                 border: '1px solid #86efac',
                                 width: '100%',
                                 textAlign: 'center',
                                 boxSizing: 'border-box'
                              }}>
                                 ✓ Scheduled
                              </span>
                           ) : (
                              <button
                                 onClick={() => acceptDelivery(delivery._id)}
                                 style={{ padding: '8px 16px', backgroundColor: '#87ab69', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
                              >
                                 Accept Route
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