import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { io } from 'socket.io-client';

export default function VendorSales() {
   const [orders, setOrders] = useState([]);
   const { token } = useContext(AuthContext);

   // 1. Fetch initial orders from the database
   useEffect(() => {
      const fetchVendorOrders = async () => {
         try {
            const res = await axios.get(import.meta.env.VITE_API_URL + '/api/orders/vendor', {
               headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
         } catch (err) { console.error(err); }
      };
      if (token) fetchVendorOrders();
   }, [token]);

   // 2. The Live Socket.io Connection
   useEffect(() => {
      const socket = io(import.meta.env.VITE_API_URL + '');

      socket.on('orderStatusUpdated', (updatedOrder) => {
         setOrders(prevOrders => {
            const isMyOrder = prevOrders.some(o => o._id === updatedOrder._id);

            if (isMyOrder) {
               if (updatedOrder.status === 'Accepted') {
                  alert(`🚗 Heads up! Driver ${updatedOrder.driverId?.name || ''} is on their way to pick up Order #${updatedOrder._id.slice(-6).toUpperCase()}`);
               }
               return prevOrders.map(order =>
                  order._id === updatedOrder._id ? updatedOrder : order
               );
            }
            return prevOrders;
         });
      });

      return () => socket.disconnect();
   }, []);

   return (
      <div>
         <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', color: '#4b6043' }}>
            My Sales & Pickups (Live 🔴)
         </h2>

         <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #c7ddb5', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
               <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif' }}>
                  <thead>
                     <tr style={{ backgroundColor: '#ddead1', color: '#4b6043', borderBottom: '1px solid #c7ddb5' }}>
                        <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>Order ID</th>
                        <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>Items to Pack</th>
                        <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>My Earnings</th>
                        <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>Status</th>
                     </tr>
                  </thead>
                  <tbody>
                     {orders.length === 0 ? (
                        <tr>
                           <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: '#658354', fontStyle: 'italic' }}>
                              No orders right now. Waiting for buyers...
                           </td>
                        </tr>
                     ) : (
                        orders.map((order, index) => (
                           <tr key={order._id} style={{ borderBottom: index === orders.length - 1 ? 'none' : '1px solid #e5e7eb' }}>
                              <td style={{ padding: '16px 24px', fontWeight: 'bold', color: '#374151' }}>
                                 #{order._id.slice(-6).toUpperCase()}
                              </td>
                              <td style={{ padding: '16px 24px', color: '#4b6043' }}>
                                 {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                              </td>
                              <td style={{ padding: '16px 24px', fontWeight: 'bold', color: '#166534' }}>
                                 ₹{order.vendorEarnings || order.totalAmount}
                              </td>
                              <td style={{ padding: '16px 24px' }}>
                                 <span style={{
                                    backgroundColor: order.status === 'Pending' ? '#fee2e2' : order.status === 'Accepted' ? '#dcfce7' : '#fef08a',
                                    color: order.status === 'Pending' ? '#991b1b' : order.status === 'Accepted' ? '#166534' : '#854d0e',
                                    padding: '6px 12px',
                                    borderRadius: '16px',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                 }}>
                                    {order.status === 'Accepted' ? 'Driver on the way' : order.status}
                                 </span>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}