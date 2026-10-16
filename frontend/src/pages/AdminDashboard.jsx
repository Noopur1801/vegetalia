export default function AdminDashboard() {
   return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', color: '#374151' }}>

         {/* Header section matching the reference image */}
         <div style={{ marginBottom: '32px' }}>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#111827' }}>Welcome back, Admin</h1>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '15px' }}>Here's what's happening on Vegetillya today</p>
         </div>

         {/* Row 1: Four Metric Cards */}
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '24px' }}>

            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
               <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '14px', fontWeight: 'bold' }}>Active Orders</p>
               <h2 style={{ margin: '0 0 8px 0', fontSize: '32px', color: '#111827' }}>24</h2>
               <p style={{ margin: 0, color: '#10b981', fontSize: '13px', fontWeight: 'bold' }}>+3 new this hour</p>
            </div>

            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
               <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '14px', fontWeight: 'bold' }}>Total Vendors</p>
               <h2 style={{ margin: '0 0 8px 0', fontSize: '32px', color: '#111827' }}>128</h2>
               <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>12 online now</p>
            </div>

            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
               <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '14px', fontWeight: 'bold' }}>Deliveries Completed</p>
               <h2 style={{ margin: '0 0 8px 0', fontSize: '32px', color: '#111827' }}>842</h2>
               <p style={{ margin: 0, color: '#10b981', fontSize: '13px', fontWeight: 'bold' }}>+18 today</p>
            </div>

            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
               <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '14px', fontWeight: 'bold' }}>Platform Revenue</p>
               <h2 style={{ margin: '0 0 8px 0', fontSize: '32px', color: '#111827' }}>87%</h2>
               <p style={{ margin: 0, color: '#10b981', fontSize: '13px', fontWeight: 'bold' }}>+5% this month</p>
            </div>

         </div>

         {/* Row 2: Main Content Grid */}
         <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

            {/* Left Column: Weekly Activity Chart */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
               <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', color: '#111827' }}>Weekly Activity</h3>

               {/* Mocked SVG Chart replacing the image's blue graph with the app's green theme */}
               <div style={{ flex: 1, position: 'relative', minHeight: '250px', display: 'flex', alignItems: 'flex-end' }}>
                  <svg viewBox="0 0 500 200" style={{ width: '100%', height: '100%', overflow: 'visible' }} preserveAspectRatio="none">
                     <defs>
                        <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                           <stop offset="0%" stopColor="#87ab69" stopOpacity="0.4" />
                           <stop offset="100%" stopColor="#87ab69" stopOpacity="0.0" />
                        </linearGradient>
                     </defs>
                     {/* Grid lines */}
                     <line x1="0" y1="50" x2="500" y2="50" stroke="#f3f4f6" strokeWidth="1" />
                     <line x1="0" y1="100" x2="500" y2="100" stroke="#f3f4f6" strokeWidth="1" />
                     <line x1="0" y1="150" x2="500" y2="150" stroke="#f3f4f6" strokeWidth="1" />
                     {/* Data Path */}
                     <path d="M 0 150 Q 50 120, 100 80 T 200 120 T 300 40 T 400 90 T 500 60 L 500 200 L 0 200 Z" fill="url(#chartGradient)" />
                     <path d="M 0 150 Q 50 120, 100 80 T 200 120 T 300 40 T 400 90 T 500 60" fill="none" stroke="#4b6043" strokeWidth="3" />

                     {/* Data Points */}
                     <circle cx="100" cy="80" r="4" fill="#4b6043" />
                     <text x="100" y="65" fontSize="12" fill="#6b7280" textAnchor="middle">48</text>
                     <circle cx="200" cy="120" r="4" fill="#4b6043" />
                     <text x="200" y="105" fontSize="12" fill="#6b7280" textAnchor="middle">40</text>
                     <circle cx="300" cy="40" r="4" fill="#4b6043" />
                     <text x="300" y="25" fontSize="12" fill="#6b7280" textAnchor="middle">70</text>
                     <circle cx="400" cy="90" r="4" fill="#4b6043" />
                     <text x="400" y="75" fontSize="12" fill="#6b7280" textAnchor="middle">54</text>
                  </svg>

                  {/* X-Axis Labels */}
                  <div style={{ position: 'absolute', bottom: '-24px', left: 0, right: 0, display: 'flex', justifyContent: 'space-between', color: '#9ca3af', fontSize: '12px' }}>
                     <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
               </div>
            </div>

            {/* Right Column: Stacked Feeds */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

               {/* Top Right Card: Upcoming Events (Adapted from Upcoming Meetings) */}
               <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#111827' }}>System Alerts</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#4b5563', fontSize: '14px' }}>
                     <div style={{ display: 'flex', gap: '16px' }}><span style={{ color: '#6b7280', width: '45px' }}>10:00</span> Vendor Payouts</div>
                     <div style={{ display: 'flex', gap: '16px' }}><span style={{ color: '#6b7280', width: '45px' }}>13:00</span> Sync Driver DB</div>
                     <div style={{ display: 'flex', gap: '16px' }}><span style={{ color: '#6b7280', width: '45px' }}>16:00</span> Platform Backup</div>
                  </div>
               </div>

               {/* Bottom Right Card: Recent Activity Table */}
               <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', flex: 1 }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#111827' }}>Recent Activity</h3>

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                     <thead>
                        <tr style={{ color: '#9ca3af', borderBottom: '1px solid #f3f4f6' }}>
                           <th style={{ paddingBottom: '8px', fontWeight: 'normal' }}>Name | Action</th>
                           <th style={{ paddingBottom: '8px', fontWeight: 'normal' }}>Time</th>
                           <th style={{ paddingBottom: '8px', fontWeight: 'normal' }}>Status</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr>
                           <td style={{ padding: '12px 0', color: '#374151' }}>John approved new vendor</td>
                           <td style={{ padding: '12px 0', color: '#6b7280' }}>10 min ago</td>
                           <td style={{ padding: '12px 0' }}><span style={{ color: '#10b981' }}>✓ Completed</span></td>
                        </tr>
                        <tr>
                           <td style={{ padding: '12px 0', color: '#374151' }}>Sarah reported an issue</td>
                           <td style={{ padding: '12px 0', color: '#6b7280' }}>24 min ago</td>
                           <td style={{ padding: '12px 0' }}><span style={{ color: '#f59e0b' }}>● Pending</span></td>
                        </tr>
                        <tr>
                           <td style={{ padding: '12px 0', color: '#374151' }}>System auto-reboot</td>
                           <td style={{ padding: '12px 0', color: '#6b7280' }}>1 hour ago</td>
                           <td style={{ padding: '12px 0' }}><span style={{ color: '#10b981' }}>✓ Completed</span></td>
                        </tr>
                        <tr>
                           <td style={{ padding: '12px 0', color: '#374151' }}>Emma updated marketplace</td>
                           <td style={{ padding: '12px 0', color: '#6b7280' }}>2 hours ago</td>
                           <td style={{ padding: '12px 0' }}><span style={{ color: '#3b82f6' }}>● Active</span></td>
                        </tr>
                     </tbody>
                  </table>
               </div>

            </div>
         </div>
      </div>
   );
}