// src/data/courseData.js
// This is the complete and corrected data source.

export const allCategoryBubbles = [
  'Class 12th', 'JEE', 'NEET', 'UPSC', 'Physics', 'Chemistry'
];

export const categories = {
  'jee': { name: 'JEE Preparation', description: 'Comprehensive preparation for the Joint Entrance Examination.', subjects: ['jee-physics', 'jee-chemistry', 'jee-maths'] },
  'neet': { name: 'NEET Preparation', description: 'Your gateway to top medical colleges in India.', subjects: ['neet-biology'] },
  'class-12th': { name: 'Class 12th', description: 'Master the core subjects for your board exams.', subjects: ['c12-physics', 'c12-chemistry'] },
  'physics': { name: 'Physics', description: 'Explore the fundamental principles of the universe.', subjects: ['physics-mechanics'] },
  'default': { name: 'Category Not Found', description: 'Content for this category is coming soon!', subjects: [] }
};

export const subjects = {
  'jee-physics': { name: 'JEE Physics', illustration: 'https://placehold.co/600x400/A78BFA/ffffff?text=Physics', channels: ['pw-channel'] },
  'jee-chemistry': { name: 'JEE Chemistry', illustration: 'https://placehold.co/600x400/10B981/ffffff?text=Chemistry', channels: ['vj-channel'] },
  'jee-maths': { name: 'JEE Maths', illustration: 'https://placehold.co/600x400/EF4444/ffffff?text=Maths', channels: [] },
  'neet-biology': { name: 'NEET Biology', illustration: 'https://placehold.co/600x400/4ADE80/FFFFFF?text=Biology', channels: ['am-channel'] },
  'c12-physics': { name: 'Physics', illustration: 'https://placehold.co/600x400/38BDF8/ffffff?text=Physics', channels: ['pw-channel'] },
  'c12-chemistry': { name: 'Chemistry', illustration: 'https://placehold.co/600x400/F472B6/FFFFFF?text=Chemistry', channels: [] },
  'physics-mechanics': { name: 'Mechanics', illustration: 'https://placehold.co/600x400/38BDF8/ffffff?text=Mechanics', channels: ['pw-channel'] },
};

export const channels = {
  'pw-channel': {
    slug: 'pw-channel', name: 'Physics Wallah', teacher: 'Alakh Pandey', avatar: 'https://placehold.co/100x100/A78BFA/FFFFFF?text=AP', specialty: 'Conceptual Physics',
    teacherBio: 'Alakh Pandey is renowned for simplifying complex physics concepts, making them accessible to every student.',
    members: [ 'https://placehold.co/40x40/f87171/ffffff?text=S', 'https://placehold.co/40x40/fbbf24/ffffff?text=R' ],
    allVideos: [
      { id: 'HnoPHq_sS-A', title: 'The Shocking History of AI and Machine Learning!', views: '137K', age: '10 days ago', duration: '10:10' },
      { id: '1-M_4C3gXoY', title: 'C Language Tutorial for Beginners', views: '4.1M', age: '11 months ago', duration: '10:03:19' },
    ]
  },
  'vj-channel': {
    slug: 'vj-channel', name: 'Vedantu JEE', teacher: 'Pulkitt Jain', avatar: 'https://placehold.co/100x100/F97316/FFFFFF?text=PJ', specialty: 'Organic Chemistry',
    teacherBio: 'Pulkitt Jain specializes in Organic Chemistry, providing students with unique tricks for JEE.',
    members: [],
    allVideos: [ { id: 'B-ytM22a24A', title: 'Chapter 1: General Organic Chemistry', views: '2.1M', age: '1 year ago', duration: '45:10' } ]
  },
  'am-channel': {
    slug: 'am-channel', name: 'Dr. Anand Mani', teacher: 'Dr. Anand Mani', avatar: 'https://placehold.co/100x100/F472B6/FFFFFF?text=AM', specialty: 'Medical Prep',
    teacherBio: 'Dr. Anand Mani focuses on providing the best possible education for medical aspirants in India.',
    members: [],
    allVideos: []
  }
};