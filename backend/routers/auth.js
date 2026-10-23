import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; 
import VendorProfile from '../models/VendorProfile.js';
import BuyerProfile from '../models/BuyerProfile.js';
import DriverProfile from '../models/DriverProfile.js';

const router = express.Router();

// 1. REGISTER ROUTE (Fast Signup)
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body; 

    // 🛡️ Admin Security Lock
    if (role === 'admin') {
      return res.status(403).json({ message: "Admin registration is locked." });
    }

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required.' });
    }
    if (!['buyer', 'vendor', 'driver'].includes(role)) {
      return res.status(400).json({ message: 'Please select a valid account role.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profileModel = role === 'buyer' ? 'BuyerProfile' : role === 'vendor' ? 'VendorProfile' : 'DriverProfile';
    const newUser = await User.create({ email: normalizedEmail, password: hashedPassword, role, profileModel });

    // Create the role-specific profile so the matching dashboard has a profile document.
    if (role === 'buyer') await BuyerProfile.create({ userId: newUser._id });
    if (role === 'vendor') await VendorProfile.create({ userId: newUser._id, businessName: 'My Business' });
    if (role === 'driver') await DriverProfile.create({ userId: newUser._id });

    res.status(201).json({ message: 'User registered successfully!', userId: newUser._id, role: newUser.role });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

// 2. LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    console.log("👉 1. Login attempt started for:", req.body.email);
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
        console.log("❌ 2. Failed: User not found in database");
        return res.status(404).json({ message: "User not found!" });
    }
    console.log("✅ 2. User found in database!");

    let isMatch = false;
    if (user.password && user.password.startsWith('$2')) {
      console.log("👉 3. Password is hashed, checking with bcrypt...");
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      console.log("👉 3. Password is plain-text, doing a direct check...");
      isMatch = (password === user.password);
    }

    if (!isMatch) {
        console.log("❌ 4. Failed: Passwords did not match");
        return res.status(400).json({ message: "Invalid credentials!" });
    }
    console.log("✅ 4. Password matched!");

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured.');
      return res.status(500).json({ message: 'Server authentication is not configured.' });
    }

    console.log("👉 5. Generating JWT token...");
    const token = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
    );

    console.log("🎉 6. Success! Sending token to frontend");
    res.status(200).json({ 
        token, 
        user: { id: user._id, email: user.email, role: user.role } 
    });
  } catch (err) { 
    console.error("🔥 CRASH IN LOGIN ROUTE:", err.message);
    res.status(500).json({ error: err.message }); 
  }
});

export default router;