import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function AdminAnalytics() {
   const [stats, setStats] = useState(null);
   const [loading, setLoading] = useState(true);
   const { token } = useContext(AuthContext);

   useEffect(() => {
      const fetchAnalytics = async () => {
         try {
            const res = await axios.get('http://localhost:5000/api/admin/analytics', {
               headers: { Authorization: `Bearer ${token}` }
            });
            setStats(res.data);
         } catch (err) {
            console.error("Error fetching analytics:", err);
         } finally {
            setLoading(false);
         }
      };

      if (token) fetchAnalytics();
   }, [token]);

   const StatCard = ({ title, value, color }) => (
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', flex: '1', minWidth: '200px' }}>
         <h3 style={{ margin: 0, fontSize: '14px', color: '#6b7280', textTransform: 'uppercase' }}>{title}</h3>
         <p style={{ margin: '8px 0 0', fontSize: '32px', fontWeight: 'bold', color: color }}>{value}</p>
      </div>
   );

   return (
      <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
         <h2 style={{ marginTop: 0, color: '#2b3f44', marginBottom: '24px' }}>Platform Analytics</h2>

         {loading || !stats ? (
            <p>Loading analytics...</p>
         ) : (
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
               <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} color="#166534" />
               <StatCard title="Total Orders" value={stats.totalOrders} color="#2b3f44" />
               <StatCard title="Active Buyers" value={stats.totalBuyers} color="#2563eb" />
               <StatCard title="Registered Vendors" value={stats.totalVendors} color="#d97706" />
               <StatCard title="Active Drivers" value={stats.totalDrivers} color="#7c3aed" />
            </div>
         )}
      </div>
   );
}