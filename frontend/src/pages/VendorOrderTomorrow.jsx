import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function VendorOrdersTomorrow() {
   const [orders, setOrders] = useState([]);
   const { token } = useContext(AuthContext);

   useEffect(() => {
      const fetchOrders = async () => {
         try {
            const res = await axios.get(import.meta.env.VITE_API_URL + '/api/orders/vendor', {
               headers: { Authorization: `Bearer ${token}` }
            });
            // Filter Scheduled orders (You can adjust this filter later if you add specific dates to the backend)
            const scheduledOrders = res.data.filter(order => order.deliveryType === 'Scheduled');
            setOrders(scheduledOrders);
         } catch (err) {
            console.error("Error fetching orders:", err);
         }
      };
      if (token) fetchOrders();
   }, [token]);

   const markAsReady = async (id) => {
      try {
         await axios.put(`import.meta.env.VITE_API_URL + '/api/orders/${id}/vendor-status`,
            { status: "Prepped" },
            { headers: { Authorization: `Bearer ${token}` } }
         );
         setOrders(orders.map(order => order._id === id ? { ...order, status: "Prepped" } : order));
      } catch (err) {
         console.error("Failed to update status:", err);
         alert("Could not update order status.");
      }
   };

   return (
      <div>
         <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', color: '#4b6043' }}>Orders for Tomorrow</h2>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.length === 0 ? <p>No orders for tomorrow.</p> : orders.map(order => (
               <div key={order._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #c7ddb5' }}>
                  <div style={{ flex: 1 }}>
                     <h3 style={{ margin: '0 0 8px 0', color: '#4b6043', fontSize: '18px' }}>#{order._id.substring(0, 8)}</h3>
                     <p style={{ margin: '0 0 4px 0', color: '#374151', fontWeight: 'bold' }}>
                        {order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                     </p>
                     <p style={{ margin: 0, color: '#658354', fontSize: '14px' }}>Buyer: {order.buyerId?.name || 'Unknown'} | Total: ₹{order.totalAmount}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                     <span style={{
                        backgroundColor: order.status === "Prepped" ? '#ddead1' : '#fef08a',
                        color: order.status === "Prepped" ? '#4b6043' : '#854d0e',
                        padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold'
                     }}>
                        {order.status}
                     </span>

                     {order.status === "Pending" && (
                        <button
                           onClick={() => markAsReady(order._id)}
                           style={{ padding: '8px 16px', backgroundColor: '#87ab69', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                           Mark Prepped
                        </button>
                     )}
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}