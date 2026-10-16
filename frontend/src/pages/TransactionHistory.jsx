import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function TransactionHistory() {
   const [transactions, setTransactions] = useState([]);
   const { token } = useContext(AuthContext);

   useEffect(() => {
      const fetchTransactions = async () => {
         try {
            const res = await axios.get('http://localhost:5000/api/orders/my-orders', {
               headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(res.data);
         } catch (err) {
            console.error("Error fetching transactions:", err);
         }
      };
      if (token) fetchTransactions();
   }, [token]);

   return (
      <div>
         <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', color: '#4b6043' }}>Transaction History</h2>

         <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #c7ddb5', overflow: 'hidden' }}>
            <div style={{ display: 'flex', backgroundColor: '#ddead1', padding: '16px 24px', fontWeight: 'bold', color: '#4b6043', borderBottom: '1px solid #c7ddb5' }}>
               <div style={{ flex: 2 }}>Transaction Details</div>
               <div style={{ flex: 1 }}>Payment Method</div>
               <div style={{ flex: 1, textAlign: 'right' }}>Amount</div>
               <div style={{ flex: 1, textAlign: 'right' }}>Status</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
               {transactions.length === 0 ? (
                  <p style={{ padding: '24px', textAlign: 'center', color: '#658354' }}>No transactions found.</p>
               ) : transactions.map((txn, index) => (
                  <div
                     key={txn._id}
                     style={{
                        display: 'flex',
                        padding: '16px 24px',
                        borderBottom: index === transactions.length - 1 ? 'none' : '1px solid #e5e7eb',
                        alignItems: 'center'
                     }}
                  >
                     <div style={{ flex: 2 }}>
                        <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#374151' }}>#{txn._id.substring(0, 10)}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#658354' }}>{new Date(txn.createdAt).toLocaleString()}</p>
                     </div>
                     <div style={{ flex: 1, color: '#4b6043', fontSize: '14px' }}>
                        Online
                     </div>
                     <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold', color: '#374151' }}>
                        ₹{txn.totalAmount}
                     </div>
                     <div style={{ flex: 1, textAlign: 'right' }}>
                        <span style={{
                           backgroundColor: txn.paymentStatus === 'Paid' || txn.paymentStatus === 'Settled' ? '#dcfce7' : '#fee2e2',
                           color: txn.paymentStatus === 'Paid' || txn.paymentStatus === 'Settled' ? '#166534' : '#991b1b',
                           padding: '4px 12px',
                           borderRadius: '16px',
                           fontSize: '12px',
                           fontWeight: 'bold'
                        }}>
                           {txn.paymentStatus}
                        </span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}