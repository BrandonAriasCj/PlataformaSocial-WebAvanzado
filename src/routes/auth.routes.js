import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';

const router = express.Router();

// POST /api/auth/signUp
router.post('/signUp', async (req, res) => {
  try {
    const { name, lastName, phoneNumber, birthdate, email, password } = req.body;

    // Validate required fields
    if (!name || !lastName || !phoneNumber || !birthdate || !email || !password) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email' 
      });
    }

    // Get default user role
    let userRole = await Role.findOne({ name: 'user' });
    if (!userRole) {
      userRole = await Role.create({ name: 'user' });
    }

    // Create new user
    const user = new User({
      name,
      lastName,
      phoneNumber,
      birthdate: new Date(birthdate),
      email,
      password,
      roles: [userRole._id]
    });

    await user.save();

    res.status(201).json({ 
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/auth/signIn
router.post('/signIn', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Find user with roles
    const user = await User.findOne({ email }).populate('roles');
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        roles: user.roles.map(role => role.name)
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        roles: user.roles.map(role => role.name)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
