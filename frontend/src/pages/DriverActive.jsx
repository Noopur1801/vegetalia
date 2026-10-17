import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function DriverActive() {
   const [orders, setOrders] = useState([]);
   const { token } = useContext(AuthContext);

   const totalEarnings = orders
      .filter(order => order.status === 'Delivered' && order.paymentStatus === 'Settled')
      .reduce((sum, order) => sum + (order.driverFee || 50), 0);

   const activeJobs = orders.filter(order => order.status !== 'Delivered');

   useEffect(() => {
      if (token) fetchActiveJobs();
   }, [token]);

   const fetchActiveJobs = async () => {
      try {
         const res = await axios.get(import.meta.env.VITE_API_URL + '/api/orders/driver/active', {
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
         fetchActiveJobs();
      } catch (err) { alert("Failed to accept order"); }
   };

   const updateStatus = async (orderId, newStatus) => {
      try {
         await axios.put(`import.meta.env.VITE_API_URL + '/api/orders/${orderId}/status`, { status: newStatus }, {
            headers: { Authorization: `Bearer ${token}` }
         });
         fetchActiveJobs();
      } catch (err) { alert("Failed to update status"); }
   };

   return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'Inter, sans-serif' }}>
         <h1 style={{ marginBottom: '24px' }}>My Active Route</h1>

         <div className="inner-card" style={{ backgroundColor: '#2d4d35', color: 'white', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderRadius: '12px' }}>
            <div>
               <p style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9 }}>Available Balance</p>
               <h2 style={{ margin: 0, fontSize: '32px' }}>₹{totalEarnings}</h2>
            </div>
            <button style={{ backgroundColor: 'white', color: '#2d4d35', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
               Withdraw to Bank
            </button>
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {activeJobs.length === 0 ? (
               <p style={{ color: '#6b7280' }}>No active deliveries. Go find some jobs!</p>
            ) : (
               activeJobs.map(order => (
                  <div key={order._id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white' }}>

                     <div style={{ backgroundColor: '#bfdbfe', padding: '12px 20px', fontWeight: 'bold', color: '#1e40af' }}>
                        Current Status: {order.status}
                     </div>

                     <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                           <div>
                              <h4 style={{ margin: '0 0 8px 0', color: '#dc2626' }}>📍 PICK UP FROM:</h4>
                              <p style={{ margin: 0, fontWeight: 'bold' }}>{order.items[0]?.vendorId?.businessName || order.items[0]?.vendorId?.name || 'Vendor'}</p>
                              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6b7280' }}>{order.items[0]?.vendorId?.address || 'Address hidden'}</p>
                           </div>
                           <div>
                              <h4 style={{ margin: '0 0 8px 0', color: '#16a34a' }}>🏁 DROP OFF AT:</h4>
                              <p style={{ margin: 0, fontWeight: 'bold' }}>{order.buyerId?.name || 'Buyer'}</p>
                              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6b7280' }}>{order.buyerId?.address || 'Address hidden'}</p>
                           </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                           <div style={{ fontSize: '14px' }}>
                              <strong>Package:</strong> {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                           </div>
                           <div style={{ display: 'flex', gap: '10px' }}>
                              {order.status === 'Pending' && (
                                 <button onClick={() => acceptOrder(order._id)} style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    Accept Delivery
                                 </button>
                              )}
                              {order.status === 'Accepted' && (
                                 <button onClick={() => updateStatus(order._id, 'Picked Up')} style={{ padding: '10px 20px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    Mark as Picked Up
                                 </button>
                              )}
                              {order.status === 'Picked Up' && (
                                 <button onClick={() => updateStatus(order._id, 'Delivered')} style={{ padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    Mark as Delivered
                                 </button>
                              )}
                           </div>
                        </div>

                     </div>
                  </div>
               ))
            )}
         </div>
      </div>
   );
}