import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function VendorAddProduct() {
   const { token } = useContext(AuthContext);
   const [loading, setLoading] = useState(false);
   const [message, setMessage] = useState('');
   const [image, setImage] = useState(null);

   const [formData, setFormData] = useState({
      name: '',
      price: '',
      stock: '',
      description: '',
      availability: 'today' // Default for your sidebars
   });

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      // Package text and file data together
      const formData = new FormData();
      formData.append('name', name); // Ensure these match your state variables
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('description', description);
      formData.append('availability', availability);
      if (image) {
         formData.append('image', image);
      }

      try {
         const res = await axios.post(import.meta.env.VITE_API_URL + '/api/products', formData, {
            headers: {
               'Content-Type': 'multipart/form-data', // Required for sending files
               Authorization: `Bearer ${token}`
            }
         });
         alert("Product added successfully!");
         // Reset form states here
      } catch (err) {
         console.error(err);
         alert("Failed to add product");
      }
   };

   return (
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', padding: '32px', borderRadius: '12px', border: '1px solid #c7ddb5' }}>
         <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', color: '#4b6043' }}>Add New Product</h2>

         {message && (
            <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '6px', backgroundColor: message.includes('✅') ? '#dcfce7' : '#fee2e2', color: message.includes('✅') ? '#166534' : '#991b1b' }}>
               {message}
            </div>
         )}

         <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div>
               <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: 'bold', fontSize: '14px' }}>Product Name (e.g., Tomatoes, Potatoes)</label>
               <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
               />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
               <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: 'bold', fontSize: '14px' }}>Price (₹ per kg)</label>
                  <input
                     type="number"
                     name="price"
                     value={formData.price}
                     onChange={handleChange}
                     required
                     min="1"
                     style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                  />
               </div>

               <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: 'bold', fontSize: '14px' }}>Stock Available (kg)</label>
                  <input
                     type="number"
                     name="stock"
                     value={formData.stock}
                     onChange={handleChange}
                     required
                     min="1"
                     style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                  />
               </div>
            </div>

            <div>
               <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: 'bold', fontSize: '14px' }}>Sidebar Availability Category</label>
               <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: 'white' }}
               >
                  <option value="today">Available Today</option>
                  <option value="yesterday">Available Yesterday</option>
                  <option value="15_days">Available in 15 Days</option>
               </select>
            </div>

            <div>
               <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: 'bold', fontSize: '14px' }}>Short Description</label>
               <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', resize: 'vertical' }}
               />
            </div>

            <div style={{ marginBottom: '16px' }}>
               <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Product Image</label>
               <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={(e) => setImage(e.target.files[0])}
                  style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
               />
            </div>

            <button
               type="submit"
               disabled={loading}
               style={{ marginTop: '12px', padding: '12px', backgroundColor: '#4b6043', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
               {loading ? 'Adding Product...' : 'Add Product'}
            </button>
         </form>
      </div>
   );
}