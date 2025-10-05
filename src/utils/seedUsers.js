import User from '../models/User.js';
import Role from '../models/Role.js';

export const seedUsers = async () => {
  try {
    // Create roles if they don't exist
    const adminRole = await Role.findOne({ name: 'admin' });
    if (!adminRole) {
      await Role.create({ name: 'admin' });
      console.log('Admin role created');
    }

    const userRole = await Role.findOne({ name: 'user' });
    if (!userRole) {
      await Role.create({ name: 'user' });
      console.log('User role created');
    }

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Get admin role
    const adminRoleDoc = await Role.findOne({ name: 'admin' });

    // Create admin user
    const adminUser = new User({
      name: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      phoneNumber: '+1234567890',
      birthdate: new Date('1990-01-01'),
      password: 'Admin123@', // This will be hashed by the pre-save middleware
      roles: [adminRoleDoc._id]
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@example.com');
    console.log('Password: Admin123@');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

export default seedUsers;
