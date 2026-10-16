import { useState } from 'react';

// --- DUMMY DATA FOR TOMORROW ---
const TOMORROW_VENDORS = [
   { id: 3, shopName: "Sunrise Organics", vendorName: "Priya Patel", rating: 4.9, discount: "New Harvest", desc: "Farm-fresh greens arriving tomorrow morning.", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300" },
   { id: 4, shopName: "The Root Cellar", vendorName: "Vikram Singh", rating: 4.6, discount: "5% OFF", desc: "Premium potatoes, onions, and root veggies.", image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=300" }
];

const TOMORROW_PRODUCTS = {
   vegetables: [
      { id: 301, name: "Broccoli", price: "₹80/kg" },
      { id: 302, name: "Sweet Potatoes", price: "₹50/kg" },
      { id: 303, name: "Bell Peppers", price: "₹100/kg" }
   ],
   fruits: [
      { id: 401, name: "Papaya", price: "₹60/piece" },
      { id: 402, name: "Pomegranates", price: "₹150/kg" }
   ]
};

export default function AvailableTomorrow() {
   const [selectedVendor, setSelectedVendor] = useState(null);

   return (
      <div>
         {/* VIEW A: VENDOR LIST */}
         {!selectedVendor ? (
            <>
               <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', color: '#4b6043' }}>Vendors Available Tomorrow</h2>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                  {TOMORROW_VENDORS.map(vendor => (
                     <div
                        key={vendor.id}
                        onClick={() => setSelectedVendor(vendor)}
                        style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #c7ddb5', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s', ':hover': { transform: 'translateY(-4px)' } }}
                     >
                        <img src={vendor.image} alt={vendor.shopName} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                        <div style={{ padding: '16px' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                              <h3 style={{ margin: 0, fontSize: '18px', color: '#4b6043' }}>{vendor.shopName}</h3>
                              <span style={{ backgroundColor: '#ddead1', color: '#4b6043', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>⭐ {vendor.rating}</span>
                           </div>
                           <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#658354' }}>By {vendor.vendorName}</p>
                           <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#374151' }}>{vendor.desc}</p>
                           <span style={{ backgroundColor: '#b3cf99', color: '#4b6043', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{vendor.discount}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </>
         ) : (
            /* VIEW B: INSIDE A SPECIFIC VENDOR */
            <>
               <button
                  onClick={() => setSelectedVendor(null)}
                  style={{ background: 'none', border: 'none', color: '#658354', cursor: 'pointer', fontWeight: 'bold', marginBottom: '16px', padding: 0 }}
               >
                  ← Back to Vendors
               </button>

               <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #c7ddb5' }}>
                  <img src={selectedVendor.image} alt={selectedVendor.shopName} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                     <h2 style={{ margin: '0 0 8px 0', color: '#4b6043' }}>{selectedVendor.shopName}</h2>
                     <p style={{ margin: 0, color: '#658354' }}>{selectedVendor.desc} • ⭐ {selectedVendor.rating}</p>
                  </div>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  {/* Vegetables Column */}
                  <div>
                     <h3 style={{ borderBottom: '2px solid #c7ddb5', paddingBottom: '8px', marginBottom: '16px', color: '#4b6043' }}>🥬 Vegetables</h3>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {TOMORROW_PRODUCTS.vegetables.map(item => (
                           <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                              <span style={{ fontWeight: 'bold', color: '#374151' }}>{item.name}</span>
                              <span style={{ color: '#658354', fontWeight: 'bold' }}>{item.price}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Fruits Column */}
                  <div>
                     <h3 style={{ borderBottom: '2px solid #c7ddb5', paddingBottom: '8px', marginBottom: '16px', color: '#4b6043' }}>🍎 Fruits</h3>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {TOMORROW_PRODUCTS.fruits.map(item => (
                           <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                              <span style={{ fontWeight: 'bold', color: '#374151' }}>{item.name}</span>
                              <span style={{ color: '#658354', fontWeight: 'bold' }}>{item.price}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </>
         )}
      </div>
   );
}