// --- DUMMY TRANSACTIONS ---
const TRANSACTIONS = [
   { id: "TXN-0012948", date: "Oct 5, 2026, 02:15 PM", amount: "₹340", method: "UPI", status: "Success" },
   { id: "TXN-0012901", date: "Sep 28, 2026, 11:30 AM", amount: "₹180", method: "Credit Card", status: "Success" },
   { id: "TXN-0012855", date: "Sep 15, 2026, 09:45 AM", amount: "₹550", method: "Wallet", status: "Failed" },
   { id: "TXN-0012842", date: "Sep 15, 2026, 09:50 AM", amount: "₹550", method: "Wallet", status: "Success" }
];

export default function TransactionHistory() {
   return (
      <div>
         <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', color: '#4b6043' }}>Transaction History</h2>

         <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #c7ddb5', overflow: 'hidden' }}>
            {/* Table Header */}
            <div style={{ display: 'flex', backgroundColor: '#ddead1', padding: '16px 24px', fontWeight: 'bold', color: '#4b6043', borderBottom: '1px solid #c7ddb5' }}>
               <div style={{ flex: 2 }}>Transaction Details</div>
               <div style={{ flex: 1 }}>Payment Method</div>
               <div style={{ flex: 1, textAlign: 'right' }}>Amount</div>
               <div style={{ flex: 1, textAlign: 'right' }}>Status</div>
            </div>

            {/* Table Rows */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               {TRANSACTIONS.map((txn, index) => (
                  <div
                     key={txn.id}
                     style={{
                        display: 'flex',
                        padding: '16px 24px',
                        borderBottom: index === TRANSACTIONS.length - 1 ? 'none' : '1px solid #e5e7eb',
                        alignItems: 'center'
                     }}
                  >
                     <div style={{ flex: 2 }}>
                        <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#374151' }}>{txn.id}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#658354' }}>{txn.date}</p>
                     </div>
                     <div style={{ flex: 1, color: '#4b6043', fontSize: '14px' }}>
                        {txn.method}
                     </div>
                     <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold', color: '#374151' }}>
                        {txn.amount}
                     </div>
                     <div style={{ flex: 1, textAlign: 'right' }}>
                        <span style={{
                           backgroundColor: txn.status === 'Success' ? '#dcfce7' : '#fee2e2',
                           color: txn.status === 'Success' ? '#166534' : '#991b1b',
                           padding: '4px 12px',
                           borderRadius: '16px',
                           fontSize: '12px',
                           fontWeight: 'bold'
                        }}>
                           {txn.status}
                        </span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}