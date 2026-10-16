import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function VendorReviews() {
   const [reviews, setReviews] = useState([]);
   const { token } = useContext(AuthContext);

   useEffect(() => {
      const fetchVendorReviews = async () => {
         try {
            const res = await axios.get('http://localhost:5000/api/vendors/reviews', {
               headers: { Authorization: `Bearer ${token}` }
            });
            setReviews(res.data);
         } catch (err) {
            console.error("Error fetching vendor reviews:", err);
         }
      };
      if (token) fetchVendorReviews();
   }, [token]);

   return (
      <div>
         <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', color: '#4b6043' }}>Customer Reviews</h2>

         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {reviews.length === 0 ? (
               <p style={{ color: '#658354' }}>No reviews yet. Keep up the good work and they will come!</p>
            ) : (
               reviews.map(review => (
                  <div key={review._id} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #c7ddb5' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                           <h3 style={{ margin: '0 0 4px 0', color: '#4b6043', fontSize: '16px' }}>{review.buyerId?.name || "Anonymous Buyer"}</h3>
                           <p style={{ margin: 0, color: '#658354', fontSize: '12px' }}>
                              {new Date(review.createdAt).toLocaleDateString()}
                           </p>
                        </div>
                        <div style={{ fontSize: '18px' }}>
                           {/* Render stars based on rating number */}
                           {"⭐".repeat(review.rating)}
                        </div>
                     </div>
                     <p style={{ margin: 0, color: '#374151', fontSize: '14px', lineHeight: '1.5' }}>
                        "{review.comment}"
                     </p>
                  </div>
               ))
            )}
         </div>
      </div>
   );
}