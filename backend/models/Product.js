import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: { type: String, required: true },
  name: { type: String, required: true },
  // FIX: Removed required: true and added a default so it stops crashing
  category: { type: String, default: 'General' }, 
  imageUrl: { type: String, default: 'https://placehold.co/400x300?text=Fresh+Vegetable' },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  unit: { type: String, required: true, default: 'kg' }, 
  description: { type: String },
  availability: { 
    type: String, 
    enum: ['today', 'yesterday', '15_days'],
    default: 'today' 
  }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);