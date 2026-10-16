//vendor delivery report page

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function VendorDeliveryReport() {
   const [reports, setReports] = useState([]);
   const { token } = useContext(AuthContext);

   useEffect(() => {
      const fetchReports = async () => {
         try {
            const res = await axios.get('http://localhost:5000/api/orders/vendor', {
               headers: { Authorization: `Bearer ${token}` }
            });
            // Only show orders that have been successfully delivered
            const deliveredOrders = res.data.filter(order => order.status === 'Delivered');
            setReports(deliveredOrders);
         } catch (err) {
            console.error("Error fetching delivery reports:", err);
         }
      };
      if (token) fetchReports();
   }, [token]);

   return (
      <div>
         <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', color: '#4b6043' }}>Delivery Reports</h2>

         <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #c7ddb5', overflow: 'hidden' }}>
            {/* Table Header */}
            <div style={{ display: 'flex', backgroundColor: '#ddead1', padding: '16px 24px', fontWeight: 'bold', color: '#4b6043', borderBottom: '1px solid #c7ddb5' }}>
               <div style={{ flex: 1 }}>Order ID</div>
               <div style={{ flex: 1 }}>Date</div>
               <div style={{ flex: 1 }}>Driver</div>
               <div style={{ flex: 1, textAlign: 'center' }}>Items Delivered</div>
               <div style={{ flex: 1, textAlign: 'right' }}>Status</div>
            </div>

            {/* Table Rows */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               {reports.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#658354' }}>No completed deliveries yet.</div>
               ) : reports.map((report, index) => (
                  <div
                     key={report._id}
                     style={{
                        display: 'flex',
                        padding: '16px 24px',
                        borderBottom: index === reports.length - 1 ? 'none' : '1px solid #e5e7eb',
                        alignItems: 'center'
                     }}
                  >
                     <div style={{ flex: 1, fontWeight: 'bold', color: '#374151' }}>
                        #{report._id.substring(0, 8)}
                     </div>
                     <div style={{ flex: 1, color: '#658354', fontSize: '14px' }}>
                        {new Date(report.createdAt).toLocaleDateString()}
                     </div>
                     <div style={{ flex: 1, color: '#4b6043', fontWeight: 'bold' }}>
                        {report.driverId?.name || 'Unassigned'}
                     </div>
                     <div style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', color: '#374151' }}>
                        {report.items.reduce((total, item) => total + item.quantity, 0)}
                     </div>
                     <div style={{ flex: 1, textAlign: 'right', color: '#658354', fontSize: '14px', fontWeight: 'bold' }}>
                        Completed
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}