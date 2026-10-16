import express from 'express';
import Product from '../models/Product.js';
import VendorProfile from '../models/VendorProfile.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
const router = express.Router();

// 1. Configure Cloudinary using your .env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Set up Multer Storage to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'vegetalia_products', // Creates a dedicated folder in your Cloudinary account
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp']
  }
});
const upload = multer({ storage: storage });

// 3. POST Route: Add upload.single('image') middleware
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  try {
    if (req.user.role !== 'vendor') return res.status(403).json({ message: "Only vendors can add products" });

    const currentUserId = req.user.id || req.user._id;
    const vendorProfile = await VendorProfile.findOne({ userId: currentUserId });

    // Cloudinary automatically returns the live URL in req.file.path
    const imageUrl = req.file ? req.file.path : 'https://placehold.co/400x300?text=Fresh+Vegetable';

    const newProduct = new Product({
      vendorId: currentUserId,
      businessName: vendorProfile?.businessName || 'Unknown Vendor',
      imageUrl: imageUrl, 
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock,
      unit: req.body.unit || 'kg',
      description: req.body.description,
      availability: req.body.availability || 'today'
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET: Vendor gets ONLY their own products
router.get('/my-products', verifyToken, async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Buyers get ALL available products
router.get('/all', verifyToken, async (req, res) => {
  try {
    const products = await Product.find({ stock: { $gt: 0 } }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Vendor updates a product (like marking it out of stock)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    // Finds the product by its ID and ensures only the owning vendor can update it
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.user.id },
      { $set: req.body },
      { new: true }
    );
    
    if (!updatedProduct) return res.status(404).json({ message: "Product not found or unauthorized" });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Vendor deletes a product
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, vendorId: req.user.id });
    if (!product) return res.status(404).json({ message: "Product not found or unauthorized" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;