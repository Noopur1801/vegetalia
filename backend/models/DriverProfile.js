import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, default: '' },
  vehicleType: { type: String, default: '' },
  licenseNumber: { type: String, default: '' },
  vehiclePlate: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true },
  phone: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('DriverProfile', driverSchema);