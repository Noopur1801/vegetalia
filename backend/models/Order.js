import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  items: [{
    productId: String,
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    quantity: Number,
    price: Number,
    image: { type: String } // 📸 NEW: Holds the product image URL
  }],
  totalAmount: { type: Number, required: true },
  deliveryType: { type: String, enum: ['Today', 'Scheduled'], required: true }, 
status: { type: String, enum: ['Pending', 'Confirmed', 'Packed', 'Prepped', 'Accepted', 'Picked Up', 'Delivered'], default: 'Pending' },  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Settled'], default: 'Pending' },
  vendorEarnings: { type: Number, default: 0 },
  driverFee: { type: Number, default: 0 },
  platformFee: { type: Number, default: 0 },
  
  // ⭐ NEW: Rating System (1 to 5 stars)
  vendorRating: { type: Number, min: 1, max: 5 },
  driverRating: { type: Number, min: 1, max: 5 }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);