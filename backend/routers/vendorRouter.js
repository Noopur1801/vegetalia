import express from 'express';
import VendorProfile from '../models/VendorProfile.js';
import Order from '../models/Order.js'; 
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// PUT /api/vendor/profile (Update profile)
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { businessName, gstNumber, phone, address } = req.body;

    // Find the profile by the user ID in the token and update it
    const updatedProfile = await VendorProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { businessName, gstNumber, phone, address } },
      { returnDocument: 'after' }   
 );

    if (!updatedProfile) return res.status(404).json({ message: "Profile not found" });

    res.status(200).json({ message: "Profile updated successfully", profile: updatedProfile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/vendor/stats
router.get('/stats', verifyToken, async (req, res) => {
  try {
    // Find all completed orders for this vendor using the userId from the token
    const orders = await Order.find({ 
      vendorId: req.user.id, 
      status: 'Delivered' 
    });

    const totalOrders = orders.length;
    // Sum up the totalAmount of each order
    const totalEarnings = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    res.status(200).json({ totalOrders, totalEarnings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch the logged-in vendor's profile (with Auto-Create Failsafe)
router.get('/profile', verifyToken, async (req, res) => {
  try {
    // 1. Try to find the profile
    let profile = await VendorProfile.findOne({ userId: req.user.id }).populate('userId', 'name email');
    
    // 2. FAILSAFE: If no profile exists yet, create a blank one automatically!
    if (!profile) {
      const newProfile = new VendorProfile({ 
        userId: req.user.id,
        businessName: 'My Business', // Default placeholder
      });
      await newProfile.save();
      
      // Fetch it again so it has the populated 'userId' data attached
      profile = await VendorProfile.findOne({ userId: req.user.id }).populate('userId', 'name email');
    }
    
    // 3. Send the profile back to the frontend
    res.status(200).json(profile);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/vendor/reviews
router.get('/reviews', verifyToken, async (req, res) => {
  try {
    // Sending an empty array for now since there is no Review model yet
    res.status(200).json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;