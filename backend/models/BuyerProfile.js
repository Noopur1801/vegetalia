import mongoose from 'mongoose';

const buyerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, default: '' },
  contactPerson: { type: String, default: '' },
  deliveryAddress: { type: String, default: '' },
  phone: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('BuyerProfile', buyerSchema);