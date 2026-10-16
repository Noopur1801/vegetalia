import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, default: '' },
  department: { type: String, default: 'General' }
}, { timestamps: true });

export default mongoose.model('AdminProfile', adminSchema);