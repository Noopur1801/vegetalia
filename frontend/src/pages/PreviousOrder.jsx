import { useState } from 'react';

// --- DUMMY PAST ORDERS ---
const PAST_ORDERS = [
   { id: "#ORD-992", date: "Oct 5, 2026", vendor: "Green Valley Farms", driver: "Rajesh Kumar", total: "₹340", status: "Delivered", reviewed: false },
   { id: "#ORD-845", date: "Sep 28, 2026", vendor: "City Fresh Veggies", driver: "Amit Singh", total: "₹180", status: "Delivered", reviewed: true }
];

export default function PreviousOrders() {
   const [orders, setOrders] = useState(PAST_ORDERS);

   // Dummy function to simulate submitting a review
   const handleReviewSubmit = (orderId) => {
      setOrders(orders.map(o => o.id === orderId ? { ...o, reviewed: true } : o));
      alert(`Thank you! Your reviews for Order ${orderId} have been saved.`);
   };

   return (
      <div>
         <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', color: '#4b6043' }}>Previous Orders & Bills</h2>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {orders.map(order => (
               <div key={order.id} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #c7ddb5', display: 'flex', flexWrap: 'wrap', gap: '24px' }}>

                  {/* Left Side: Bill Details */}
                  <div style={{ flex: '1 1 300px', borderRight: '1px solid #c7ddb5', paddingRight: '24px' }}>
                     <h3 style={{ margin: '0 0 12px 0', color: '#4b6043' }}>Order {order.id}</h3>
                     <p style={{ margin: '0 0 4px 0', color: '#658354', fontSize: '14px' }}>Date: {order.date}</p>
                     <p style={{ margin: '0 0 4px 0', color: '#658354', fontSize: '14px' }}>Total Amount: <strong style={{ color: '#4b6043' }}>{order.total}</strong></p>
                     <span style={{ display: 'inline-block', marginTop: '12px', backgroundColor: '#ddead1', color: '#4b6043', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold' }}>
                        ✓ {order.status}
                     </span>
                  </div>

                  {/* Right Side: Dual Review System */}
                  <div style={{ flex: '1 1 300px' }}>
                     {order.reviewed ? (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#658354' }}>
                           <span style={{ fontSize: '24px', marginBottom: '8px' }}>⭐</span>
                           <p style={{ margin: 0, fontWeight: 'bold' }}>Reviews Submitted</p>
                           <p style={{ margin: 0, fontSize: '12px' }}>Thank you for your feedback!</p>
                        </div>
                     ) : (
                        <>
                           <h4 style={{ margin: '0 0 16px 0', color: '#4b6043' }}>Leave a Review</h4>
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                              {/* Vendor Review */}
                              <div>
                                 <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>🏪 Shop: {order.vendor}</p>
                                 <select style={{ padding: '8px', width: '100%', borderRadius: '6px', border: '1px solid #c7ddb5', color: '#4b6043', backgroundColor: '#f9fafb' }}>
                                    <option>⭐⭐⭐⭐⭐ - Excellent Quality</option>
                                    <option>⭐⭐⭐⭐ - Good</option>
                                    <option>⭐⭐⭐ - Average</option>
                                    <option>⭐⭐ - Below Average</option>
                                    <option>⭐ - Poor</option>
                                 </select>
                              </div>

                              {/* Driver Review */}
                              <div>
                                 <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>🛵 Delivery Partner: {order.driver}</p>
                                 <select style={{ padding: '8px', width: '100%', borderRadius: '6px', border: '1px solid #c7ddb5', color: '#4b6043', backgroundColor: '#f9fafb' }}>
                                    <option>⭐⭐⭐⭐⭐ - Very Polite & Fast</option>
                                    <option>⭐⭐⭐⭐ - On Time</option>
                                    <option>⭐⭐⭐ - Average</option>
                                    <option>⭐⭐ - Late</option>
                                    <option>⭐ - Unprofessional</option>
                                 </select>
                              </div>

                              <button
                                 onClick={() => handleReviewSubmit(order.id)}
                                 style={{ padding: '10px', backgroundColor: '#4b6043', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}
                              >
                                 Submit Reviews
                              </button>
                           </div>
                        </>
                     )}
                  </div>

               </div>
            ))}
         </div>
      </div>
   );
}