
const mongoose = require('mongoose');
const User = require('../models/User');
const GroupChat = require('../models/GroupChat');
const LiveSession = require('../models/LiveSession');
require('dotenv').config();

const sampleUsers = [
  {
    name: 'Suresh Rawat',
    email: 'suresh@edtech.com',
    password: 'password123',
    role: 'teacher',
    subjects: ['Mathematics', 'Physics'],
    class: 'Grade 10'
  },
  {
    name: 'John Doe',
    email: 'john@student.com',
    password: 'password123',
    role: 'student',
    subjects: ['Mathematics', 'Science'],
    class: 'Grade 10'
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah@student.com',
    password: 'password123',
    role: 'student',
    subjects: ['Physics', 'Chemistry'],
    class: 'Grade 11'
  }
];

const sampleGroupChats = [
  {
    name: 'Mathematics Class',
    description: 'Discussion for mathematics topics',
    type: 'class',
    subject: 'Mathematics'
  },
  {
    name: 'Physics Lab',
    description: 'Physics experiments and discussions',
    type: 'class',
    subject: 'Physics'
  },
  {
    name: 'General Study Group',
    description: 'General academic discussions',
    type: 'study-group'
  }
];

const sampleLiveSessions = [
  {
    title: 'Quadratic Equations',
    description: 'Introduction to quadratic equations and their solutions',
    subject: 'Mathematics',
    scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    duration: 60
  },
  {
    title: 'Laws of Motion',
    description: 'Understanding Newton\'s laws of motion',
    subject: 'Physics',
    scheduledTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
    duration: 90
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edtech_platform');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await GroupChat.deleteMany({});
    await LiveSession.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = await User.create(sampleUsers);
    console.log('Created sample users');

    // Create group chats
    const teacher = createdUsers.find(user => user.role === 'teacher');
    const students = createdUsers.filter(user => user.role === 'student');

    for (const chatData of sampleGroupChats) {
      const groupChat = new GroupChat({
        ...chatData,
        admin: teacher._id,
        members: [
          { userId: teacher._id, name: teacher.name, role: 'admin' },
          ...students.map(student => ({
            userId: student._id,
            name: student.name,
            role: 'member'
          }))
        ]
      });
      await groupChat.save();
    }
    console.log('Created sample group chats');

    // Create live sessions
    for (const sessionData of sampleLiveSessions) {
      const roomId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const session = new LiveSession({
        ...sessionData,
        instructor: teacher._id,
        instructorName: teacher.name,
        roomId
      });
      await session.save();
    }
    console.log('Created sample live sessions');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

module.exports = { seedDatabase };

// Run if called directly
if (require.main === module) {
  seedDatabase();
}
