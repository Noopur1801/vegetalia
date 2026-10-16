import express from 'express';
import AdminProfile from '../models/AdminProfile.js'; // Assuming you have an AdminProfile model
import VendorProfile from '../models/VendorProfile.js'; // We need this to find vendors
import { verifyToken } from '../middlewares/authMiddleware.js';
import User from '../models/userModel.js'; 
import Order from '../models/Order.js'; 

const router = express.Router();

// 1. Get Admin's own profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const profile = await AdminProfile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch all buyers
router.get('/buyers', async (req, res) => {
  try {
    const buyers = await User.find({ role: 'buyer' }).select('-password');
    res.status(200).json(buyers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Fetch all vendors
router.get('/vendors', async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor' }).select('-password');
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// // PUT: Admin verifies a vendor
// router.put('/verify-vendor/:userId', async (req, res) => {
//   try {
//     const updatedProfile = await VendorProfile.findOneAndUpdate(
//       { userId: req.params.userId },
//       { isVerified: true },
//       { new: true }
//     );

//     if (!updatedProfile) {
//       return res.status(404).json({ message: 'Vendor profile not found.' });
//     }

//     res.status(200).json({ message: 'Vendor successfully verified!', profile: updatedProfile });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// GET: Fetch all drivers
router.get('/drivers', async (req, res) => {
  try {
    const drivers = await User.find({ role: 'driver' }).select('-password');
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Fetch all orders
router.get('/orders', async (req, res) => {
  try {
    // .populate() pulls in the actual buyer name instead of just their ID
    const orders = await Order.find().populate('buyerId', 'name').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Fetch platform analytics
router.get('/analytics', async (req, res) => {
  try {
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const totalVendors = await User.countDocuments({ role: 'vendor' });
    const totalDrivers = await User.countDocuments({ role: 'driver' });
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue (sum of all order amounts)
    const revenueData = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.status(200).json({
      totalBuyers,
      totalVendors,
      totalDrivers,
      totalOrders,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. NEW: Verify a specific vendor
router.put('/vendors/:id/verify', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: "Access denied" });

    // Find the vendor by their profile ID and set isVerified to true
    const updatedVendor = await VendorProfile.findByIdAndUpdate(
      req.params.id,
      { $set: { isVerified: true } },
      { new: true }
    );
    
    res.status(200).json({ message: "Vendor verified successfully", vendor: updatedVendor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update logged-in Admin's profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const currentUserId = req.user.id || req.user._id;
    const { name, email } = req.body;
    
    const updatedAdmin = await User.findByIdAndUpdate(
      currentUserId,
      { name, email },
      { new: true } // Returns the updated document
    ).select('-password');
    
    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Fetch all buyers for Admin dashboard
router.get('/admin/buyers', verifyToken, async (req, res) => {
  try {
    // Find all buyers and exclude the password field for security
    const buyers = await User.find({ role: 'buyer' }).select('-password');
    res.status(200).json(buyers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/admin/profile (Update admin own profile)
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { fullName, department } = req.body;

    const updatedProfile = await AdminProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { fullName, department } },
      { new: true }
    );

    if (!updatedProfile) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json({ message: "Profile updated successfully", profile: updatedProfile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;