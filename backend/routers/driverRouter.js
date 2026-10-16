import express from 'express';
import DriverProfile from '../models/DriverProfile.js';
import Order from '../models/Order.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/driver/profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const profile = await DriverProfile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/driver/all-profiles (Fetch all drivers for vendors to see)
router.get('/all-profiles', verifyToken, async (req, res) => {
  try {
    // We populate 'userId' so we can access the driver's underlying User details if needed
    const drivers = await DriverProfile.find().populate('userId', 'name email');
    res.status(200).json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/driver/stats
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const deliveries = await Order.find({ driverId: req.user.id, status: 'Delivered' });
    
    const totalDeliveries = deliveries.length;
    // Assuming a flat ₹40 earning per delivery if `driverEarnings` isn't set
    const totalEarnings = deliveries.reduce((sum, order) => sum + (order.driverEarnings || 40), 0);
    
    res.status(200).json({ totalDeliveries, totalEarnings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/driver/deliveries/today
router.get('/deliveries/today', verifyToken, async (req, res) => {
  try {
    // Find active orders assigned to this driver that are NOT delivered yet
    const deliveries = await Order.find({ 
      driverId: req.user.id,
      status: { $in: ['Pending Pickup', 'In Transit'] }
    });
    res.status(200).json(deliveries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/driver/reviews
router.get('/reviews', verifyToken, async (req, res) => {
  try {
    res.status(200).json([]); // Empty array until you build the Review model!
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;