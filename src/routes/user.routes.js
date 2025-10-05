import express from 'express';
import User from '../models/User.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users/me - Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('roles')
      .select('-password');
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        birthdate: user.birthdate,
        age: user.age,
        url_profile: user.url_profile,
        address: user.address,
        roles: user.roles.map(role => role.name),
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/users/me - Update current user profile
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const { name, lastName, phoneNumber, birthdate, url_profile, address } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (lastName) updateData.lastName = lastName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (birthdate) updateData.birthdate = new Date(birthdate);
    if (url_profile !== undefined) updateData.url_profile = url_profile;
    if (address !== undefined) updateData.address = address;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).populate('roles').select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        birthdate: user.birthdate,
        age: user.age,
        url_profile: user.url_profile,
        address: user.address,
        roles: user.roles.map(role => role.name),
        createdAt: user.createdAt
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

// GET /api/users - Get all users (admin only)
router.get('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const users = await User.find()
      .populate('roles')
      .select('-password')
      .sort({ createdAt: -1 });

    const usersData = users.map(user => ({
      id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      birthdate: user.birthdate,
      age: user.age,
      url_profile: user.url_profile,
      address: user.address,
      roles: user.roles.map(role => role.name),
      createdAt: user.createdAt
    }));

    res.json({ users: usersData });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/users/:id - Get specific user (admin only)
router.get('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('roles')
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        birthdate: user.birthdate,
        age: user.age,
        url_profile: user.url_profile,
        address: user.address,
        roles: user.roles.map(role => role.name),
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
