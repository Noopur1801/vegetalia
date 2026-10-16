import User from '../models/userModel.js';
import Order from '../models/Order.js';

// @desc    Get vendor profile details
// @route   GET /api/vendor/profile
export const getVendorProfile = async (req, res) => {
  try {
    // req.user comes from your authMiddleware
    const vendor = await User.findById(req.user._id).select('-password');
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    res.json(vendor);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get vendor sales stats
// @route   GET /api/vendor/stats
export const getVendorStats = async (req, res) => {
  try {
    // Find all completed orders for this specific vendor
    const orders = await Order.find({ 
      vendorId: req.user._id, 
      status: 'Delivered' 
    });

    const totalOrders = orders.length;
    
    // Calculate total earnings
    const totalEarnings = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    res.json({ totalOrders, totalEarnings });
  } catch (error) {
    console.error("Stats fetch error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get reviews left for this vendor
// @route   GET /api/vendor/reviews
export const getVendorReviews = async (req, res) => {
  try {
    // Since you don't have a Review.js model yet, we will send an empty array 
    // to prevent the frontend from crashing until you build the review system.
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};