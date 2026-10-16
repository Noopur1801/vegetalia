import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function AdminProfile() {
   const [profile, setProfile] = useState(null);
   const [loading, setLoading] = useState(true);
   const [isEditing, setIsEditing] = useState(false);
   const [formData, setFormData] = useState({ name: '', email: '' });
   const { token } = useContext(AuthContext);

   useEffect(() => {
      const fetchAdminProfile = async () => {
         try {
            const res = await axios.get('http://localhost:5000/api/admin/profile', {
               headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data);
            setFormData({ name: res.data.name, email: res.data.email });
         } catch (err) {
            console.error("Error fetching admin profile:", err);
         } finally {
            setLoading(false);
         }
      };
      if (token) fetchAdminProfile();
   }, [token]);

   const handleSave = async () => {
      try {
         const res = await axios.put('http://localhost:5000/api/admin/profile', formData, {
            headers: { Authorization: `Bearer ${token}` }
         });
         setProfile(res.data);
         setIsEditing(false);
      } catch (err) {
         console.error("Error updating profile:", err);
         alert("Failed to update profile.");
      }
   };

   if (loading) return <div style={{ padding: '24px' }}>Loading profile...</div>;
   if (!profile) return <div style={{ padding: '24px' }}>Profile not found.</div>;

   return (
      <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '600px', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, color: '#2b3f44' }}>Admin Profile</h2>
            <button
               onClick={() => isEditing ? handleSave() : setIsEditing(true)}
               style={{ backgroundColor: isEditing ? '#166534' : '#4b6043', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
            >
               {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
         </div>

         <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', maxWidth: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
               <div style={{ width: '80px', height: '80px', backgroundColor: '#ddead1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
                  👑
               </div>
               <div>
                  {isEditing ? (
                     <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{ fontSize: '20px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db', marginBottom: '4px', display: 'block' }}
                     />
                  ) : (
                     <h3 style={{ margin: 0, fontSize: '24px', color: '#111827' }}>{profile.name}</h3>
                  )}
                  <p style={{ margin: '4px 0 0', color: '#6b7280', textTransform: 'capitalize' }}>Platform {profile.role}</p>
               </div>
            </div>

            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
               <div>
                  <strong style={{ color: '#374151' }}>Email Address:</strong>
                  {isEditing ? (
                     <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{ marginLeft: '8px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db', width: '250px' }}
                     />
                  ) : (
                     <span style={{ marginLeft: '8px', color: '#4b5563' }}>{profile.email}</span>
                  )}
               </div>
               <p style={{ margin: 0, color: '#374151' }}>
                  <strong>Account Created:</strong> <span style={{ color: '#4b5563' }}>{new Date(profile.createdAt).toLocaleDateString()}</span>
               </p>
            </div>
         </div>
      </div>
   );
}