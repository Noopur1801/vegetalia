import { useState } from 'react';

// --- DUMMY FUTURE DELIVERY DATA ---
const FUTURE_DELIVERIES = [
   { id: "DEL-5021", date: "Oct 11, 2026", vendor: "Highland Orchards", buyer: "Anita K.", pickup: "Warehouse B", dropoff: "Sector 4, Phase 2", time: "Morning Slot", earnings: "₹85", status: "Available" },
   { id: "DEL-5025", date: "Oct 12, 2026", vendor: "Monsoon Harvest Farms", buyer: "Local Bistro", pickup: "Farm Gate 1", dropoff: "Downtown Market", time: "Afternoon Slot", earnings: "₹120", status: "Available" },
   { id: "DEL-5029", date: "Oct 15, 2026", vendor: "Green Valley Farms", buyer: "FreshMart Retail", pickup: "Shop 12, Market Sector", dropoff: "City Mall Storage", time: "Evening Slot", earnings: "₹150", status: "Accepted" }
];

export default function DriverAhead() {
   const [deliveries, setDeliveries] = useState(FUTURE_DELIVERIES);

   const acceptDelivery = (id) => {
      setDeliveries(deliveries.map(del => del.id === id ? { ...del, status: "Accepted" } : del));
   };

   return (
      <div>
         <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', color: '#4b6043' }}>Upcoming Deliveries (Schedule Ahead)</h2>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {deliveries.map(delivery => (
               <div key={delivery.id} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #c7ddb5' }}>

                  {/* Delivery Details */}
                  <div style={{ flex: '1 1 300px', minWidth: '300px' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <h3 style={{ margin: 0, color: '#4b6043', fontSize: '18px' }}>{delivery.date}</h3>
                        <span style={{ backgroundColor: '#ddead1', color: '#4b6043', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                           {delivery.time}
                        </span>
                        <span style={{ color: '#658354', fontSize: '14px', fontWeight: 'bold' }}>• {delivery.id}</span>
                     </div>

                     <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                           <span style={{ color: '#87ab69', fontWeight: 'bold' }}>↑</span>
                           <p style={{ margin: 0, fontSize: '14px', color: '#374151' }}><strong>Pickup:</strong> {delivery.vendor} ({delivery.pickup})</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                           <span style={{ color: '#ef4444', fontWeight: 'bold' }}>↓</span>
                           <p style={{ margin: 0, fontSize: '14px', color: '#374151' }}><strong>Dropoff:</strong> {delivery.buyer} ({delivery.dropoff})</p>
                        </div>
                     </div>
                  </div>

                  {/* Action Area */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', minWidth: '150px' }}>
                     <p style={{ margin: 0, fontWeight: 'bold', color: '#166534', fontSize: '18px' }}>{delivery.earnings}</p>

                     {delivery.status === "Accepted" ? (
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
                           onClick={() => acceptDelivery(delivery.id)}
                           style={{ padding: '8px 16px', backgroundColor: '#87ab69', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
                        >
                           Accept Route
                        </button>
                     )}
                  </div>

               </div>
            ))}
         </div>
      </div>
   );
}