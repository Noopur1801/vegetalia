import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function AdminOrders() {
   const [orders, setOrders] = useState([]);
   const [loading, setLoading] = useState(true);
   const { token } = useContext(AuthContext);

   useEffect(() => {
      const fetchOrders = async () => {
         try {
            const res = await axios.get('http://localhost:5000/api/admin/orders', {
               headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
         } catch (err) {
            console.error("Error fetching orders:", err);
         } finally {
            setLoading(false);
         }
      };

      if (token) fetchOrders();
   }, [token]);

   return (
      <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
         <h2 style={{ marginTop: 0, color: '#2b3f44', marginBottom: '24px' }}>All Platform Orders</h2>

         {loading ? (
            <p>Loading orders...</p>
         ) : (
            <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                     <tr>
                        <th style={{ padding: '12px 16px', color: '#4b5563', fontWeight: 'bold' }}>Order ID</th>
                        <th style={{ padding: '12px 16px', color: '#4b5563', fontWeight: 'bold' }}>Buyer</th>
                        <th style={{ padding: '12px 16px', color: '#4b5563', fontWeight: 'bold' }}>Total</th>
                        <th style={{ padding: '12px 16px', color: '#4b5563', fontWeight: 'bold' }}>Status</th>
                     </tr>
                  </thead>
                  <tbody>
                     {orders.length === 0 ? (
                        <tr>
                           <td colSpan="4" style={{ padding: '16px', textAlign: 'center' }}>No orders found.</td>
                        </tr>
                     ) : (
                        orders.map((order) => (
                           <tr key={order._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                              <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '14px' }}>
                                 {order._id.substring(0, 8)}...
                              </td>
                              <td style={{ padding: '12px 16px', color: '#111827' }}>
                                 {order.buyerId ? order.buyerId.name : 'Unknown'}
                              </td>
                              <td style={{ padding: '12px 16px', color: '#111827', fontWeight: 'bold' }}>
                                 ₹{order.totalAmount}
                              </td>
                              <td style={{ padding: '12px 16px' }}>
                                 <span style={{
                                    backgroundColor: order.status === 'Delivered' ? '#dcfce7' : '#fef9c3',
                                    color: order.status === 'Delivered' ? '#166534' : '#854d0e',
                                    padding: '4px 8px',
                                    borderRadius: '999px',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                 }}>
                                    {order.status}
                                 </span>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         )}
      </div>
   );
}