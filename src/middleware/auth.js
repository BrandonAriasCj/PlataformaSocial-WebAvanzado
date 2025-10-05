import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';

// Middleware to verify JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).populate('roles');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    req.userRoles = user.roles.map(role => role.name);
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user has required role
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.userRoles || !req.userRoles.some(role => roles.includes(role))) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

// Middleware for frontend JWT verification (for EJS views)
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
      return res.redirect('/signIn');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).populate('roles');
    
    if (!user) {
      res.clearCookie('token');
      return res.redirect('/signIn');
    }

    req.user = user;
    req.userRoles = user.roles.map(role => role.name);
    next();
  } catch (error) {
    res.clearCookie('token');
    return res.redirect('/signIn');
  }
};

// Middleware to check admin role for frontend
export const requireAdmin = (req, res, next) => {
  if (!req.userRoles || !req.userRoles.includes('admin')) {
    return res.render('403', { message: 'Access denied. Admin role required.' });
  }
  next();
};
