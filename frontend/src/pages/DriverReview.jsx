// --- DUMMY DRIVER REVIEW DATA ---
const DRIVER_REVIEWS = [
   { id: "DREV-1", date: "Oct 9, 2026", buyer: "Rahul M.", rating: "⭐⭐⭐⭐⭐", comment: "Very Polite & Fast. Delivered right to my door without any hassle." },
   { id: "DREV-2", date: "Oct 8, 2026", buyer: "Anita K.", rating: "⭐⭐⭐⭐", comment: "On Time. Followed the drop-off instructions perfectly." },
   { id: "DREV-3", date: "Oct 5, 2026", buyer: "Amit Singh", rating: "⭐⭐⭐⭐⭐", comment: "Great communication and very fast delivery!" }
];

export default function DriverReviews() {
   return (
      <div>
         <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', color: '#4b6043' }}>My Delivery Reviews</h2>

         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {DRIVER_REVIEWS.map(review => (
               <div key={review.id} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #c7ddb5' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                     <div>
                        <h3 style={{ margin: '0 0 4px 0', color: '#4b6043', fontSize: '16px' }}>{review.buyer}</h3>
                        <p style={{ margin: 0, color: '#658354', fontSize: '12px' }}>{review.date}</p>
                     </div>
                     <div style={{ fontSize: '18px' }}>{review.rating}</div>
                  </div>
                  <p style={{ margin: 0, color: '#374151', fontSize: '14px', lineHeight: '1.5' }}>
                     "{review.comment}"
                  </p>
               </div>
            ))}
         </div>
      </div>
   );
}