import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function DriverToday() {
   const [deliveries, setDeliveries] = useState([]);
   const { token } = useContext(AuthContext);

   useEffect(() => {
      const fetchDeliveries = async () => {
         try {
            const res = await axios.get('http://localhost:5000/api/driver/deliveries/today', {
               headers: { Authorization: `Bearer ${token}` }
            });
            setDeliveries(res.data);
         } catch (err) {
            console.error("Error fetching deliveries:", err);
         }
      };
      if (token) fetchDeliveries();
   }, [token]);

   const updateStatus = async (id, currentStatus) => {
      let nextStatus = currentStatus === "Pending Pickup" ? "In Transit" : "Delivered";
      try {
         // Tell the backend to update the order status
         await axios.put(`http://localhost:5000/api/orders/${id}/status`,
            { status: nextStatus },
            { headers: { Authorization: `Bearer ${token}` } }
         );

         // Update local state so the UI changes instantly
         setDeliveries(deliveries.map(del => del._id === id ? { ...del, status: nextStatus } : del));
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
               deliveries.map(delivery => (
                  <div key={delivery._id} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #c7ddb5' }}>

                     <div style={{ flex: '1 1 300px', minWidth: '300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                           <h3 style={{ margin: 0, color: '#4b6043', fontSize: '18px' }}>#{delivery._id.slice(-6).toUpperCase()}</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                           <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                              <span style={{ color: '#87ab69', fontWeight: 'bold' }}>↑</span>
                              <p style={{ margin: 0, fontSize: '14px', color: '#374151' }}><strong>Pickup:</strong> {delivery.vendorId?.businessName || 'Vendor'} ({delivery.vendorId?.address || 'Store'})</p>
                           </div>
                           <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                              <span style={{ color: '#ef4444', fontWeight: 'bold' }}>↓</span>
                              <p style={{ margin: 0, fontSize: '14px', color: '#374151' }}><strong>Dropoff:</strong> {delivery.buyerId?.name || 'Customer'} ({delivery.shippingAddress})</p>
                           </div>
                        </div>
                     </div>

                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', minWidth: '150px' }}>
                        <p style={{ margin: 0, fontWeight: 'bold', color: '#166534', fontSize: '18px' }}>₹{delivery.driverEarnings || 40}</p>

                        <span style={{
                           backgroundColor: delivery.status === "Delivered" ? '#dcfce7' : delivery.status === "In Transit" ? '#fef08a' : '#fee2e2',
                           color: delivery.status === "Delivered" ? '#166534' : delivery.status === "In Transit" ? '#854d0e' : '#991b1b',
                           padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold'
                        }}>
                           {delivery.status}
                        </span>

                        {delivery.status !== "Delivered" && (
                           <button
                              onClick={() => updateStatus(delivery._id, delivery.status)}
                              style={{ padding: '8px 16px', backgroundColor: '#87ab69', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
                           >
                              {delivery.status === "Pending Pickup" ? "Confirm Pickup" : "Mark Delivered"}
                           </button>
                        )}
                     </div>

                  </div>
               ))
            )}
         </div>
      </div>
   );
}