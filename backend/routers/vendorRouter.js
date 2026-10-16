import express from 'express';
import VendorProfile from '../models/VendorProfile.js';
import Order from '../models/Order.js'; 
import { verifyToken } from '../middlewares/authMiddleware.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Configure Cloudinary (Make sure your .env variables are set!)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'vegetalia_vendors', // Saves to a specific folder in Cloudinary
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp']
  }
});
const upload = multer({ storage: storage });

// PUT /api/vendor/profile (Update profile with Image Upload)
router.put('/profile', verifyToken, upload.single('shopImage'), async (req, res) => {
  try {
    const { businessName, gstNumber, phone, address } = req.body;
    
    // Build the update object
    let updateData = { businessName, gstNumber, phone, address };
    
    // If a new image was uploaded, attach the Cloudinary URL
    if (req.file) {
      updateData.shopImage = req.file.path;
    }

    const updatedProfile = await VendorProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updateData },
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
    const orders = await Order.find({ vendorId: req.user.id, status: 'Delivered' });
    const totalOrders = orders.length;
    const totalEarnings = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    res.status(200).json({ totalOrders, totalEarnings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch the logged-in vendor's profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    let profile = await VendorProfile.findOne({ userId: req.user.id }).populate('userId', 'name email');
    
    if (!profile) {
      const newProfile = new VendorProfile({ 
        userId: req.user.id,
        businessName: 'My Business',
      });
      await newProfile.save();
      profile = await VendorProfile.findOne({ userId: req.user.id }).populate('userId', 'name email');
    }
    
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/reviews', verifyToken, async (req, res) => {
  try {
    res.status(200).json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/vendor/all-profiles (For buyers to browse vendors)
router.get('/all-profiles', verifyToken, async (req, res) => {
  try {
    const profiles = await VendorProfile.find().populate('userId', 'name');
    res.status(200).json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;