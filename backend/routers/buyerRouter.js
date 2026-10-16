import express from 'express';
import BuyerProfile from '../models/BuyerProfile.js';
import Order from '../models/Order.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/buyer/profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const profile = await BuyerProfile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/buyer/profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { phone, address, defaultPaymentMethod } = req.body;
    const updatedProfile = await BuyerProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { phone, address, defaultPaymentMethod } },
      { new: true, upsert: true } // upsert: true creates it if it doesn't exist yet!
    );
    res.status(200).json({ message: "Profile updated", profile: updatedProfile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/buyer/orders
router.get('/orders', verifyToken, async (req, res) => {
  try {
    // Find all orders placed by this buyer, sort by newest first
    const orders = await Order.find({ buyerId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;