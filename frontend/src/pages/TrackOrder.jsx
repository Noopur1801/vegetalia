// --- DUMMY ACTIVE ORDERS ---
const ACTIVE_ORDERS = [
   {
      id: "#ORD-8819",
      vendor: "Green Valley Farms",
      total: "₹240",
      eta: "Today, 4:30 PM",
      status: 2, // 0 = Placed, 1 = Picked Up, 2 = Out for Delivery, 3 = Delivered
      driver: "Suresh",
      driverPhone: "+91 98765 43210"
   }
];

export default function TrackOrders() {
   const steps = ["Order Placed", "Picked Up", "Out for Delivery", "Delivered"];

   return (
      <div>
         <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', color: '#4b6043' }}>Live Order Tracking</h2>

         {ACTIVE_ORDERS.length === 0 ? (
            <p style={{ color: '#658354' }}>You have no active orders right now.</p>
         ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
               {ACTIVE_ORDERS.map(order => (
                  <div key={order.id} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #c7ddb5' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '24px' }}>
                        <div>
                           <h3 style={{ margin: '0 0 8px 0', color: '#4b6043' }}>Order {order.id}</h3>
                           <p style={{ margin: 0, color: '#658354', fontSize: '14px' }}>Vendor: {order.vendor} • Total: {order.total}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                           <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold' }}>Estimated Arrival</p>
                           <p style={{ margin: 0, color: '#4b6043', fontWeight: 'bold', fontSize: '18px' }}>{order.eta}</p>
                        </div>
                     </div>

                     {/* Progress Bar UI */}
                     <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '32px' }}>
                        {/* Background Line */}
                        <div style={{ position: 'absolute', top: '12px', left: '10%', right: '10%', height: '4px', backgroundColor: '#e5e7eb', zIndex: 0 }}></div>

                        {/* Active Progress Line */}
                        <div style={{ position: 'absolute', top: '12px', left: '10%', width: `${(order.status / (steps.length - 1)) * 80}%`, height: '4px', backgroundColor: '#87ab69', zIndex: 1, transition: 'width 0.4s ease' }}></div>

                        {steps.map((step, index) => {
                           const isActive = index <= order.status;
                           return (
                              <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, width: '25%' }}>
                                 <div style={{
                                    width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: isActive ? '#4b6043' : 'white', border: `4px solid ${isActive ? '#87ab69' : '#e5e7eb'}`,
                                    color: isActive ? 'white' : 'transparent', fontWeight: 'bold', fontSize: '12px'
                                 }}>
                                    {isActive ? '✓' : ''}
                                 </div>
                                 <p style={{ margin: '8px 0 0 0', fontSize: '12px', fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#4b6043' : '#6b7280', textAlign: 'center' }}>
                                    {step}
                                 </p>
                              </div>
                           );
                        })}
                     </div>

                     {order.status > 0 && order.status < 3 && (
                        <div style={{ backgroundColor: '#f4fbf4', padding: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                           <div style={{ width: '40px', height: '40px', backgroundColor: '#b3cf99', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                              🛵
                           </div>
                           <div>
                              <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#658354' }}>Your Delivery Partner</p>
                              <p style={{ margin: 0, fontWeight: 'bold', color: '#4b6043' }}>{order.driver} • {order.driverPhone}</p>
                           </div>
                        </div>
                     )}
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}