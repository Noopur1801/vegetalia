import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DriverDashboard() {
   const [profile, setProfile] = useState(null);
   const [loading, setLoading] = useState(true);
   const [isEditing, setIsEditing] = useState(false);

   const [formData, setFormData] = useState({ fullName: '', vehicleType: '', licenseNumber: '' });

   const { token, logout } = useContext(AuthContext);
   const navigate = useNavigate();

   useEffect(() => {
      const fetchProfile = async () => {
         try {
            const res = await axios.get('http://localhost:5000/api/driver/profile', { headers: { Authorization: `Bearer ${token}` } });
            setProfile(res.data);
            setFormData({
               fullName: res.data.fullName || '',
               vehicleType: res.data.vehicleType || '',
               licenseNumber: res.data.licenseNumber || ''
            });
         } catch (err) { console.error(err); } finally { setLoading(false); }
      };
      if (token) fetchProfile();
   }, [token]);

   const handleUpdate = async (e) => {
      e.preventDefault();
      try {
         const res = await axios.put('http://localhost:5000/api/driver/profile', formData, { headers: { Authorization: `Bearer ${token}` } });
         setProfile(res.data.profile);
         setIsEditing(false);
      } catch (err) { alert("Failed to update profile"); }
   };

   const handleLogout = () => { logout(); navigate('/login'); };

   if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading dashboard...</div>;

   return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Inter, sans-serif' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ margin: 0, color: '#111827' }}>Driver Dashboard</h1>
            <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Sign Out</button>
         </div>

         <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '16px' }}>
               <h2 style={{ fontSize: '18px', margin: 0 }}>Vehicle & Profile Info</h2>
               {!isEditing && <button onClick={() => setIsEditing(true)} style={{ padding: '6px 12px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Edit Profile</button>}
            </div>

            {isEditing ? (
               <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div><label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Full Name</label><input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} required /></div>
                  <div><label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Vehicle Type (e.g., Truck, Van)</label><input type="text" value={formData.vehicleType} onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} required /></div>
                  <div><label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>License Number</label><input type="text" value={formData.licenseNumber} onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} required /></div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                     <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#7952b3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save</button>
                     <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '8px 16px', backgroundColor: 'transparent', color: '#6b7280', border: 'none', cursor: 'pointer' }}>Cancel</button>
                  </div>
               </form>
            ) : (
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div><p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0' }}>Full Name</p><p style={{ margin: 0, fontWeight: '500' }}>{profile?.fullName || 'Not configured yet'}</p></div>
                  <div><p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0' }}>Vehicle Type</p><p style={{ margin: 0, fontWeight: '500' }}>{profile?.vehicleType || 'Not configured yet'}</p></div>
                  <div><p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0' }}>License Number</p><p style={{ margin: 0, fontWeight: '500' }}>{profile?.licenseNumber || 'Not configured yet'}</p></div>
                  <div><p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0' }}>Status</p><p style={{ margin: 0, fontWeight: '500', color: profile?.isAvailable ? '#16a34a' : '#dc2626' }}>{profile?.isAvailable ? 'Available' : 'Unavailable'}</p></div>
               </div>
            )}
         </div>
      </div>
   );
}