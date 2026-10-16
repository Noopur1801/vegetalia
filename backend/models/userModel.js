import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'vendor', 'driver', 'admin'], required: true },
  
  // 📍 Location and contact info
  name: { type: String },
  businessName: { type: String },
  address: { type: String },
  phone: { type: String },

  profileId: { type: mongoose.Schema.Types.ObjectId, refPath: 'profileModel' },
  profileModel: { type: String, enum: ['BuyerProfile', 'VendorProfile', 'DriverProfile', 'AdminProfile'] }
}, { timestamps: true });

export default mongoose.model('User', userSchema);