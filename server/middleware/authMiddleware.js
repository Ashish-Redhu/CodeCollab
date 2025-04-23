import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async(req, res, next) => {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ message: 'Not authorized' });
  try {

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user from database
    const user = await User.findById(decoded.id).select('-password');
   
    if(!user) return res.status(401).json({message: "User not found"}); // User is not found. // This is executing. 

    // Attach full user document to request.
    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token failed' })
  }
}
