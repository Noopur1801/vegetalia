export default function AdminSettings() {
   return (
      <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
         <h2 style={{ marginTop: 0, color: '#2b3f44', marginBottom: '24px' }}>Platform Settings</h2>

         <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', maxWidth: '600px' }}>
            <h3 style={{ margin: '0 0 16px', color: '#111827' }}>Commission Rates</h3>

            <div style={{ marginBottom: '16px' }}>
               <label style={{ display: 'block', marginBottom: '8px', color: '#4b5563', fontSize: '14px' }}>Platform Fee (%)</label>
               <input
                  type="number"
                  defaultValue={10}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
               />
            </div>

            <div style={{ marginBottom: '24px' }}>
               <label style={{ display: 'block', marginBottom: '8px', color: '#4b5563', fontSize: '14px' }}>Driver Base Delivery Fee (₹)</label>
               <input
                  type="number"
                  defaultValue={40}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
               />
            </div>

            <button style={{ backgroundColor: '#4b6043', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
               Save Changes
            </button>
         </div>
      </div>
   );
}