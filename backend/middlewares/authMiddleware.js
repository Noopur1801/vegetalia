import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // Grab the token from the "Authorization" header
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

  try {
    // Verify the token using your secret key
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // This attaches the { id, role } payload to the request
    next(); // Pass control to the next function
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};