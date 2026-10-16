import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function DriverProfile() {
   const [profile, setProfile] = useState(null);
   const [stats, setStats] = useState({ totalDeliveries: 0, totalEarnings: 0 });
   const { token, user } = useContext(AuthContext);

   useEffect(() => {
      const fetchDriverData = async () => {
         try {
            const profileRes = await axios.get('http://localhost:5000/api/driver/profile', {
               headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(profileRes.data);

            const statsRes = await axios.get('http://localhost:5000/api/driver/stats', {
               headers: { Authorization: `Bearer ${token}` }
            });
            setStats(statsRes.data);
         } catch (err) {
            console.error("Error fetching driver data:", err);
         }
      };
      if (token) fetchDriverData();
   }, [token]);

   if (!profile) return <p style={{ padding: '20px', color: '#658354' }}>Loading profile...</p>;

   return (
      <div>
         <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', color: '#4b6043' }}>Driver Profile</h2>

         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>

            {/* Personal Details Card */}
            <div style={{ flex: '1 1 300px', backgroundColor: 'white', padding: '32px', borderRadius: '12px', border: '1px solid #c7ddb5', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <div style={{ width: '100px', height: '100px', backgroundColor: '#ddead1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', marginBottom: '16px' }}>
                  🛵
               </div>
               <h3 style={{ margin: '0 0 8px 0', color: '#4b6043', fontSize: '24px' }}>{user.name || "Driver"}</h3>
               <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', marginBottom: '24px' }}>
                  Active Partner
               </span>

               <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                     <span style={{ color: '#658354', fontSize: '14px' }}>Phone:</span>
                     <span style={{ color: '#374151', fontWeight: 'bold', fontSize: '14px' }}>{profile.phone || "Not set"}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                     <span style={{ color: '#658354', fontSize: '14px' }}>Vehicle:</span>
                     <span style={{ color: '#374151', fontWeight: 'bold', fontSize: '14px' }}>{profile.vehicleNumber || "Not set"}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                     <span style={{ color: '#658354', fontSize: '14px' }}>License No:</span>
                     <span style={{ color: '#374151', fontWeight: 'bold', fontSize: '14px' }}>{profile.licenseNumber || "Not set"}</span>
                  </div>
               </div>
            </div>

            {/* Earnings & Stats Card */}
            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

               <div style={{ backgroundColor: '#4b6043', color: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ddead1' }}>Total Earnings</p>
                  <h3 style={{ margin: 0, fontSize: '36px' }}>₹{stats.totalEarnings}</h3>
               </div>

               <div style={{ display: 'flex', gap: '24px' }}>
                  <div style={{ flex: 1, backgroundColor: 'white', border: '1px solid #c7ddb5', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
                     <h3 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#4b6043' }}>{stats.totalDeliveries}</h3>
                     <p style={{ margin: 0, fontSize: '14px', color: '#658354', fontWeight: 'bold' }}>Total Deliveries</p>
                  </div>
               </div>

            </div>
         </div>
      </div>
   );
}