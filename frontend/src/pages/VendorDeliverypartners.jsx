import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function VendorDeliveryPartners() {
   const [drivers, setDrivers] = useState([]);
   const [assignedDriver, setAssignedDriver] = useState(null);
   const { token } = useContext(AuthContext);

   useEffect(() => {
      const fetchDrivers = async () => {
         try {
            const res = await axios.get(import.meta.env.VITE_API_URL + '/api/driver/all-profiles', {
               headers: { Authorization: `Bearer ${token}` }
            });
            setDrivers(res.data);
         } catch (err) {
            console.error("Error fetching drivers:", err);
         }
      };
      if (token) fetchDrivers();
   }, [token]);

   const handleChoose = (driver) => {
      setAssignedDriver(driver.fullName || 'Driver');
      alert(`${driver.fullName || 'Driver'} has been notified to pick up your next batch of orders!`);
   };

   return (
      <div>
         <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', color: '#4b6043' }}>Delivery Partners</h2>

         {assignedDriver && (
            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '8px', border: '1px solid #86efac', fontWeight: 'bold' }}>
               ✓ Currently assigned to: {assignedDriver}
            </div>
         )}

         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {drivers.length === 0 ? <p>No delivery partners found.</p> : drivers.map(driver => (
               <div key={driver._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #c7ddb5', opacity: driver.isAvailable ? 1 : 0.6 }}>

                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '20px' }}>
                     <div style={{ width: '60px', height: '60px', backgroundColor: '#ddead1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                        🛵
                     </div>
                     <div>
                        <h3 style={{ margin: '0 0 4px 0', color: '#4b6043', fontSize: '18px' }}>{driver.fullName || 'Unnamed Driver'}</h3>
                        <p style={{ margin: '0 0 4px 0', color: '#658354', fontSize: '14px' }}>⭐⭐⭐⭐⭐ (New Partner)</p>
                        <p style={{ margin: 0, color: '#374151', fontSize: '12px' }}>{driver.vehicleType || 'Vehicle TBA'} - {driver.vehiclePlate || 'N/A'}</p>
                     </div>
                  </div>

                  <div>
                     {driver.isAvailable ? (
                        <button
                           onClick={() => handleChoose(driver)}
                           style={{ padding: '10px 24px', backgroundColor: '#4b6043', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                           Choose
                        </button>
                     ) : (
                        <span style={{ color: '#9ca3af', fontWeight: 'bold', padding: '10px' }}>Currently Offline</span>
                     )}
                  </div>

               </div>
            ))}
         </div>
      </div>
   );
}