import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; 
import VendorProfile from '../models/VendorProfile.js';
import BuyerProfile from '../models/BuyerProfile.js';
import DriverProfile from '../models/DriverProfile.js';
import AdminProfile from '../models/AdminProfile.js';

export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // 1. Restrict to 1 Admin
    if (role === 'admin') {
      const adminExists = await User.findOne({ role: 'admin' });
      if (adminExists) {
        return res.status(403).json({ message: "An admin account already exists. Only one admin is allowed." });
      }
    }
    
    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Determine the profile model reference string
    let profileModelString;
    if (role === 'buyer') profileModelString = 'BuyerProfile';
    else if (role === 'vendor') profileModelString = 'VendorProfile';
    else if (role === 'driver') profileModelString = 'DriverProfile';
    else if (role === 'admin') profileModelString = 'AdminProfile';

    // 5. Create and save the base User document
    const newUser = new User({ 
      email, 
      password: hashedPassword, 
      role,
      profileModel: profileModelString 
    });
    const savedUser = await newUser.save();

    // 6. Generate the corresponding blank profile document linked by userId
    if (role === 'vendor') {
      await new VendorProfile({ userId: savedUser._id }).save();
    } else if (role === 'buyer') {
      await new BuyerProfile({ userId: savedUser._id }).save();
    } else if (role === 'driver') {
      await new DriverProfile({ userId: savedUser._id }).save();
    } else if (role === 'admin') {
      await new AdminProfile({ userId: savedUser._id }).save();
    }

    res.status(201).json({ 
      message: "User and profile registered successfully", 
      userId: savedUser._id,
      role: savedUser.role
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.status(200).json({ token, role: user.role, userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};