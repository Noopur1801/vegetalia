import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: { type: String, default: '' },
  gstNumber: { type: String, default: '' },
  businessAddress: { type: String, default: '' },
  phone: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('VendorProfile', vendorSchema);