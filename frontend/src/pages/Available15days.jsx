import { useState } from 'react';

// --- DUMMY DATA FOR ADVANCE BOOKINGS ---
const FUTURE_VENDORS = [
   { id: 5, shopName: "Highland Orchards", vendorName: "Tenzin Norgay", rating: 4.9, discount: "Bulk Pre-order", desc: "Reserve your seasonal apple harvest in advance.", image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=300" },
   { id: 6, shopName: "Monsoon Harvest Farms", vendorName: "Kavita Reddy", rating: 4.7, discount: "Wholesale Rates", desc: "Late-season gourds and root vegetables.", image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=300" }
];

const FUTURE_PRODUCTS = {
   vegetables: [
      { id: 501, name: "Winter Pumpkins", price: "₹30/kg" },
      { id: 502, name: "Turnips", price: "₹45/kg" }
   ],
   fruits: [
      { id: 601, name: "Fuji Apples (Box)", price: "₹800/box" },
      { id: 602, name: "Late Season Pears", price: "₹120/kg" }
   ]
};

export default function Available15Days() {
   const [selectedVendor, setSelectedVendor] = useState(null);

   return (
      <div>
         {!selectedVendor ? (
            <>
               <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', color: '#4b6043' }}>Available After 15 Days (Pre-booking)</h2>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                  {FUTURE_VENDORS.map(vendor => (
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
            <>
               <button onClick={() => setSelectedVendor(null)} style={{ background: 'none', border: 'none', color: '#658354', cursor: 'pointer', fontWeight: 'bold', marginBottom: '16px', padding: 0 }}>
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
                  <div>
                     <h3 style={{ borderBottom: '2px solid #c7ddb5', paddingBottom: '8px', marginBottom: '16px', color: '#4b6043' }}>🥬 Vegetables (Advance)</h3>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {FUTURE_PRODUCTS.vegetables.map(item => (
                           <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                              <span style={{ fontWeight: 'bold', color: '#374151' }}>{item.name}</span>
                              <span style={{ color: '#658354', fontWeight: 'bold' }}>{item.price}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div>
                     <h3 style={{ borderBottom: '2px solid #c7ddb5', paddingBottom: '8px', marginBottom: '16px', color: '#4b6043' }}>🍎 Fruits (Advance)</h3>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {FUTURE_PRODUCTS.fruits.map(item => (
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