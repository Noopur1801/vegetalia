import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function BuyerProfile() {
   const [profile, setProfile] = useState(null);
   const [orders, setOrders] = useState([]);
   const { token, user } = useContext(AuthContext);

   const [isEditing, setIsEditing] = useState(false);
   const [editData, setEditData] = useState({ phone: '', address: '' });

   useEffect(() => {
      const fetchBuyerData = async () => {
         try {
            const profileRes = await axios.get('http://localhost:5000/api/buyer/profile', {
               headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(profileRes.data);

            setEditData({
               phone: profileRes.data?.phone || '',
               address: profileRes.data?.address || ''
            });

            const ordersRes = await axios.get('http://localhost:5000/api/buyer/orders', {
               headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(ordersRes.data);
         } catch (err) {
            console.error("Error fetching buyer data:", err);
         }
      };
      if (token) fetchBuyerData();
   }, [token]);

   const handleEditChange = (e) => {
      setEditData({ ...editData, [e.target.name]: e.target.value });
   };

   const handleSave = async () => {
      try {
         const res = await axios.put('http://localhost:5000/api/buyer/profile', editData, {
            headers: { Authorization: `Bearer ${token}` }
         });

         setProfile(res.data.profile || res.data);
         setIsEditing(false);
      } catch (err) {
         console.error("Error updating profile:", err);
         alert("Failed to update profile");
      }
   };

   return (
      <div>
         <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', color: '#4b6043' }}>My Profile & Orders</h2>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', border: '1px solid #c7ddb5' }}>

               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, color: '#4b6043', fontSize: '20px' }}>Personal Information</h3>
                  {!isEditing && (
                     <button onClick={() => setIsEditing(true)} style={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                        Edit
                     </button>
                  )}
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '500px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                     <span style={{ color: '#658354', fontSize: '14px' }}>Name:</span>
                     {/* Added user?.name here */}
                     <span style={{ color: '#374151', fontWeight: 'bold', fontSize: '14px' }}>{user?.name || "Customer"}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                     <span style={{ color: '#658354', fontSize: '14px' }}>Email:</span>
                     {/* Added user?.email here */}
                     <span style={{ color: '#374151', fontWeight: 'bold', fontSize: '14px' }}>{user?.email || "Loading..."}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                     <span style={{ color: '#658354', fontSize: '14px', paddingTop: isEditing ? '8px' : '0' }}>Phone:</span>
                     {isEditing ? (
                        <input type="text" name="phone" value={editData.phone} onChange={handleEditChange} placeholder="Add phone number" style={{ padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', textAlign: 'right' }} />
                     ) : (
                        <span style={{ color: '#374151', fontWeight: 'bold', fontSize: '14px' }}>{profile?.phone || "Not provided"}</span>
                     )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                     <span style={{ color: '#658354', fontSize: '14px', paddingTop: isEditing ? '8px' : '0' }}>Delivery Address:</span>
                     {isEditing ? (
                        <textarea name="address" value={editData.address} onChange={handleEditChange} placeholder="Add address" style={{ padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', textAlign: 'right', width: '60%' }} />
                     ) : (
                        <span style={{ color: '#374151', fontWeight: 'bold', fontSize: '14px', textAlign: 'right', maxWidth: '60%' }}>
                           {profile?.address || "Please update your address"}
                        </span>
                     )}
                  </div>
               </div>

               {isEditing && (
                  <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-start' }}>
                     <button onClick={() => setIsEditing(false)} style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                     <button onClick={handleSave} style={{ padding: '8px 16px', backgroundColor: '#4b6043', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                  </div>
               )}
            </div>

            <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', border: '1px solid #c7ddb5' }}>
               <h3 style={{ margin: '0 0 16px 0', color: '#4b6043', fontSize: '20px' }}>Order History</h3>

               {orders.length === 0 ? (
                  <p style={{ color: '#658354' }}>You haven't placed any orders yet. Time to buy some fresh veggies!</p>
               ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                     {orders.map(order => (
                        <div key={order._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                           <div>
                              <h4 style={{ margin: '0 0 4px 0', color: '#374151' }}>Order #{order._id.slice(-6).toUpperCase()}</h4>
                              <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>
                                 {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                           </div>
                           <div style={{ textAlign: 'right' }}>
                              <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#166534' }}>₹{order.totalAmount}</p>
                              <span style={{
                                 backgroundColor: order.status === 'Delivered' ? '#dcfce7' : '#fef08a',
                                 color: order.status === 'Delivered' ? '#166534' : '#854d0e',
                                 padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold'
                              }}>
                                 {order.status}
                              </span>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>

         </div>
      </div>
   );
}