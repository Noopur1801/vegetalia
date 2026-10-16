import { useState } from 'react';

// --- DUMMY DATA ---
const VENDORS = [
   { id: 1, shopName: "Green Valley Farms", vendorName: "Ramesh Kumar", rating: 4.8, discount: "10% OFF", desc: "Fresh organic daily harvests.", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300" },
   { id: 2, shopName: "City Fresh Veggies", vendorName: "Anita Sharma", rating: 4.5, discount: "Free Delivery", desc: "Best root vegetables in town.", image: "https://images.unsplash.com/photo-1518843875459-f738682238a6?w=300" }
];

const VENDOR_PRODUCTS = {
   vegetables: [
      { id: 101, name: "Fresh Spinach", price: "₹40/bunch" },
      { id: 102, name: "Organic Carrots", price: "₹60/kg" }
   ],
   fruits: [
      { id: 201, name: "Apples", price: "₹120/kg" },
      { id: 202, name: "Bananas", price: "₹50/dozen" }
   ]
};

export default function AvailableToday() {
   const [selectedVendor, setSelectedVendor] = useState(null);

   return (
      <div>
         {/* VIEW A: VENDOR LIST */}
         {!selectedVendor ? (
            <>
               <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', color: '#4b6043' }}>Vendors Available Today</h2>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                  {VENDORS.map(vendor => (
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
                        {VENDOR_PRODUCTS.vegetables.map(item => (
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
                        {VENDOR_PRODUCTS.fruits.map(item => (
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