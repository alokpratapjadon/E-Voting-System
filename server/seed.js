const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const Setting = require('./models/Setting');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    console.log('Seeding initial data...');

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        voterId: 'ADMIN001',
        phone: '1234567890',
        isAdmin: true,
        phoneVerified: true
      });

      await adminUser.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }

    // Create default settings
    const defaultSettings = [
      {
        key: 'electionStartDate',
        value: new Date('2024-12-01T00:00:00Z'),
        description: 'Start date and time for the election'
      },
      {
        key: 'electionEndDate',
        value: new Date('2024-12-31T23:59:59Z'),
        description: 'End date and time for the election'
      },
      {
        key: 'votingEnabled',
        value: false,
        description: 'Whether voting is currently enabled'
      },
      {
        key: 'systemName',
        value: 'E-Voting System',
        description: 'Name of the voting system'
      },
      {
        key: 'maxCandidates',
        value: 10,
        description: 'Maximum number of candidates allowed'
      }
    ];

    for (const setting of defaultSettings) {
      const exists = await Setting.findOne({ key: setting.key });
      if (!exists) {
        await Setting.create(setting);
        console.log(`Setting '${setting.key}' created`);
      } else {
        console.log(`Setting '${setting.key}' already exists`);
      }
    }

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

// Run the seed function
const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();
