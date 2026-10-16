import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export default function AvailableToday() {
   const [vendors, setVendors] = useState([]);
   const [selectedVendor, setSelectedVendor] = useState(null);
   const { token } = useContext(AuthContext);
   const { addToCart } = useContext(CartContext);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const [prodRes, profRes] = await Promise.all([
               axios.get('http://localhost:5000/api/products/all', { headers: { Authorization: `Bearer ${token}` } }),
               axios.get('http://localhost:5000/api/vendor/all-profiles', { headers: { Authorization: `Bearer ${token}` } })
            ]);

            const todayProducts = prodRes.data.filter(p => !p.availability || p.availability.toLowerCase() === 'today');
            const profiles = profRes.data;

            const vendorMap = {};
            todayProducts.forEach(prod => {
               if (!vendorMap[prod.vendorId]) {
                  const vProfile = profiles.find(p => p.userId?._id === prod.vendorId || p.userId === prod.vendorId);

                  vendorMap[prod.vendorId] = {
                     id: prod.vendorId,
                     shopName: vProfile?.businessName || prod.businessName || "Local Farm",
                     rating: vProfile?.rating || "4.8",
                     desc: "Fresh organic daily harvests.",
                     shopImage: vProfile?.shopImage || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300",
                     products: []
                  };
               }
               vendorMap[prod.vendorId].products.push(prod);
            });

            setVendors(Object.values(vendorMap));
         } catch (err) {
            console.error("Error fetching data:", err);
         }
      };
      if (token) fetchData();
   }, [token]);

   const categorizeProducts = (products) => {
      const fruitKeywords = ['apple', 'banana', 'papaya', 'pomegranate', 'melon', 'mango', 'orange', 'pear', 'grape'];
      const fruits = [];
      const vegetables = [];
      products.forEach(p => {
         const isFruit = fruitKeywords.some(keyword => p.name.toLowerCase().includes(keyword));
         if (isFruit) fruits.push(p);
         else vegetables.push(p);
      });
      return { fruits, vegetables };
   };

   const handleAddToCart = (item) => {
      if (addToCart) {
         addToCart({
            ...item,
            vendorName: selectedVendor.shopName,
            quantity: 1
         });
         alert(`${item.name} added to cart!`);
      } else {
         alert("CartContext is not providing addToCart!");
      }
   };

   return (
      <div>
         {!selectedVendor ? (
            <>
               <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', color: '#4b6043' }}>Vendors Available Today</h2>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                  {vendors.length === 0 ? <p>No vendors available today.</p> : vendors.map(vendor => (
                     <div key={vendor.id} onClick={() => setSelectedVendor(vendor)} style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #c7ddb5', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}>
                        <img src={vendor.shopImage} alt={vendor.shopName} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                        <div style={{ padding: '16px' }}>
                           <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#4b6043' }}>{vendor.shopName}</h3>
                           <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#374151' }}>{vendor.desc}</p>
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
                  <img src={selectedVendor.shopImage} alt={selectedVendor.shopName} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                     <h2 style={{ margin: '0 0 8px 0', color: '#4b6043' }}>{selectedVendor.shopName}</h2>
                     <p style={{ margin: 0, color: '#658354' }}>{selectedVendor.desc} • ⭐ {selectedVendor.rating}</p>
                  </div>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  <div>
                     <h3 style={{ borderBottom: '2px solid #c7ddb5', paddingBottom: '8px', marginBottom: '16px', color: '#4b6043' }}>🥬 Vegetables</h3>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {categorizeProducts(selectedVendor.products).vegetables.map(item => (
                           <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}>

                              {/* --- NEW IMAGE LAYOUT --- */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                 <img
                                    src={item.imageUrl || "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=100"}
                                    alt={item.name}
                                    style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e5e7eb' }}
                                 />
                                 <span style={{ fontWeight: 'bold', color: '#374151' }}>{item.name}</span>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                 <span style={{ color: '#658354', fontWeight: 'bold' }}>₹{item.price}/{item.unit}</span>
                                 <button onClick={() => handleAddToCart(item)} style={{ backgroundColor: '#4b6043', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Add to Cart</button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div>
                     <h3 style={{ borderBottom: '2px solid #c7ddb5', paddingBottom: '8px', marginBottom: '16px', color: '#4b6043' }}>🍎 Fruits</h3>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {categorizeProducts(selectedVendor.products).fruits.map(item => (
                           <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}>

                              {/* --- NEW IMAGE LAYOUT --- */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                 <img
                                    src={item.imageUrl || "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=100"}
                                    alt={item.name}
                                    style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e5e7eb' }}
                                 />
                                 <span style={{ fontWeight: 'bold', color: '#374151' }}>{item.name}</span>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                 <span style={{ color: '#658354', fontWeight: 'bold' }}>₹{item.price}/{item.unit}</span>
                                 <button onClick={() => handleAddToCart(item)} style={{ backgroundColor: '#4b6043', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Add to Cart</button>
                              </div>
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