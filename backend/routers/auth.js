import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// Make sure this matches your exact filename (User.js or usermodel.js)
import User from '../models/userModel.js'; 

const router = express.Router();

// 1. REGISTER ROUTE (Fast Signup)
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body; 

    // 🛡️ Admin Security Lock
    if (role === 'admin') {
      return res.status(403).json({ message: "Admin registration is locked." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

// 2. LOGIN ROUTE (The missing piece!)
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

    console.log("👉 5. Generating JWT token...");
    const token = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_SECRET || 'your_secret_key', 
        { expiresIn: '1d' }
    );

    console.log("🎉 6. Success! Sending token to frontend");
    res.status(200).json({ 
        token, 
        user: { id: user._id, email: user.email, role: user.role } 
    });
  } catch (err) { 
    console.error("🔥 CRASH IN LOGIN ROUTE:", err.message); // <-- THIS FINDS THE BUG!
    res.status(500).json({ error: err.message }); 
  }
});

export default router;