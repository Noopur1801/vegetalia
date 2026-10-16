import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function VendorDashboard() {
   const [profile, setProfile] = useState(null);
   const [stats, setStats] = useState({ totalEarnings: 0, totalOrders: 0 });
   const { token, user } = useContext(AuthContext);

   // Added gstNumber to the edit state
   const [isEditing, setIsEditing] = useState(false);
   const [editData, setEditData] = useState({ businessName: '', phone: '', address: '', gstNumber: '' });

   useEffect(() => {
      const fetchVendorData = async () => {
         try {
            const profileRes = await axios.get('http://localhost:5000/api/vendor/profile', {
               headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(profileRes.data);

            // Populate the edit form with existing data, including gstNumber
            setEditData({
               businessName: profileRes.data.businessName || '',
               phone: profileRes.data.phone || '',
               address: profileRes.data.address || '',
               gstNumber: profileRes.data.gstNumber || ''
            });

            const statsRes = await axios.get('http://localhost:5000/api/vendor/stats', {
               headers: { Authorization: `Bearer ${token}` }
            });
            setStats(statsRes.data);
         } catch (err) {
            console.error("Error fetching vendor data:", err);
         }
      };
      if (token) fetchVendorData();
   }, [token]);

   const handleEditChange = (e) => {
      setEditData({ ...editData, [e.target.name]: e.target.value });
   };

   const handleSave = async () => {
      try {
         const res = await axios.put('http://localhost:5000/api/vendor/profile', editData, {
            headers: { Authorization: `Bearer ${token}` }
         });
         setProfile(res.data.profile);
         setIsEditing(false);
      } catch (err) {
         console.error("Error updating profile:", err);
         alert("Failed to update profile");
      }
   };

   if (!profile) return <p style={{ padding: '20px', color: '#658354' }}>Loading profile...</p>;

   return (
      <div>
         <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', color: '#4b6043' }}>Vendor Profile</h2>

         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>

            {/* Profile Card */}
            <div style={{ flex: '1 1 300px', backgroundColor: 'white', padding: '32px', borderRadius: '12px', border: '1px solid #c7ddb5' }}>

               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  {isEditing ? (
                     <input
                        type="text"
                        name="businessName"
                        value={editData.businessName}
                        onChange={handleEditChange}
                        placeholder="Business Name"
                        style={{ fontSize: '20px', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', width: '100%', marginRight: '12px' }}
                     />
                  ) : (
                     <h3 style={{ margin: 0, color: '#4b6043', fontSize: '24px' }}>{profile.businessName || user.name}</h3>
                  )}

                  {!isEditing && (
                     <button onClick={() => setIsEditing(true)} style={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                        Edit
                     </button>
                  )}
               </div>

               <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                     <span style={{ color: '#658354', fontSize: '14px', paddingTop: '8px' }}>Email:</span>
                     <span style={{ color: '#374151', fontWeight: 'bold', fontSize: '14px', paddingTop: '8px' }}>{user.email}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                     <span style={{ color: '#658354', fontSize: '14px', paddingTop: isEditing ? '10px' : '0' }}>Phone:</span>
                     {isEditing ? (
                        <input type="text" name="phone" value={editData.phone} onChange={handleEditChange} placeholder="Add phone number" style={{ padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', textAlign: 'right' }} />
                     ) : (
                        <span style={{ color: '#374151', fontWeight: 'bold', fontSize: '14px' }}>{profile.phone || '-'}</span>
                     )}
                  </div>

                  {/* New GST Number Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                     <span style={{ color: '#658354', fontSize: '14px', paddingTop: isEditing ? '10px' : '0' }}>GST Number:</span>
                     {isEditing ? (
                        <input type="text" name="gstNumber" value={editData.gstNumber} onChange={handleEditChange} placeholder="Add GST Number" style={{ padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', textAlign: 'right' }} />
                     ) : (
                        <span style={{ color: '#374151', fontWeight: 'bold', fontSize: '14px' }}>{profile.gstNumber || '-'}</span>
                     )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                     <span style={{ color: '#658354', fontSize: '14px', paddingTop: isEditing ? '10px' : '0' }}>Address:</span>
                     {isEditing ? (
                        <textarea name="address" value={editData.address} onChange={handleEditChange} placeholder="Add address" style={{ padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', textAlign: 'right', width: '60%' }} />
                     ) : (
                        <span style={{ color: '#374151', fontWeight: 'bold', fontSize: '14px', textAlign: 'right', maxWidth: '60%' }}>{profile.address || '-'}</span>
                     )}
                  </div>
               </div>

               {isEditing && (
                  <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                     <button onClick={() => setIsEditing(false)} style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                     <button onClick={handleSave} style={{ padding: '8px 16px', backgroundColor: '#4b6043', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                  </div>
               )}
            </div>

            {/* Stats Card */}
            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
               <div style={{ backgroundColor: '#4b6043', color: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ddead1' }}>Total Earnings</p>
                  <h3 style={{ margin: 0, fontSize: '36px' }}>₹{stats.totalEarnings}</h3>
               </div>

               <div style={{ display: 'flex', gap: '24px' }}>
                  <div style={{ flex: 1, backgroundColor: 'white', border: '1px solid #c7ddb5', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
                     <h3 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#4b6043' }}>{stats.totalOrders}</h3>
                     <p style={{ margin: 0, fontSize: '14px', color: '#658354', fontWeight: 'bold' }}>Orders Completed</p>
                  </div>
               </div>
            </div>

         </div>
      </div>
   );
}