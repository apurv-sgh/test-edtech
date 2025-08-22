// src/data/courseData.js

export const allCategoryBubbles = [ 'JEE', 'NEET', 'Class 12th' ];

export const categories = {
  'jee': { name: 'JEE Preparation', description: 'Comprehensive preparation for the Joint Entrance Examination.', channels: ['pw-channel', 'vj-channel'] },
  'neet': { name: 'NEET Preparation', description: 'Your gateway to top medical colleges in India.', channels: ['am-channel'] },
  'class-12th': { name: 'Class 12th', description: 'Master the core subjects for your board exams.', channels: ['pw-channel'] },
  'default': { name: 'Category Not Found', description: 'Content for this category is coming soon!', channels: [] }
};

export const subjects = {
  'jee-physics': { name: 'JEE Physics', channels: ['pw-channel'] },
  'jee-chemistry': { name: 'JEE Chemistry', channels: ['vj-channel'] },
  'neet-biology': { name: 'NEET Biology', channels: ['am-channel'] },
  'c12-physics': { name: 'Physics', channels: ['pw-channel'] },
};

export const channels = {
  'pw-channel': {
    name: 'Physics Wallah', teacher: 'Alakh Pandey', avatar: 'https://placehold.co/100x100/A78BFA/FFFFFF?text=AP',
    bannerImage: 'https://placehold.co/1200x300/A78BFA/FFFFFF?text=Physics+Wallah+Banner',
    teacherBio: 'Alakh Pandey is renowned for his ability to simplify complex physics concepts, making them accessible to every student. His engaging teaching style has helped millions crack the toughest exams.',
    subscriberCount: '10.2M',
    videoCount: 1532,
    joinDate: 'Joined 9 Nov 2016',
    playlists: [
      { slug: 'jee-ultimate', title: 'JEE Ultimate Physics', videoCount: 150, thumb: 'https://i.ytimg.com/vi/HnoPHq_sS-A/hqdefault.jpg' },
      { slug: 'jee-revision', title: 'JEE Revision Series', videoCount: 30, thumb: 'https://i.ytimg.com/vi/1-M_4C3gXoY/hqdefault.jpg' },
    ],
    allVideos: [
      { id: 'HnoPHq_sS-A', title: 'The Shocking History of AI and Machine Learning!', views: '137K', age: '10 days ago', duration: '10:10' },
      { id: '1-M_4C3gXoY', title: 'C Language Tutorial for Beginners (With Notes)', views: '4.1M', age: '11 months ago', duration: '10:03:19' },
      { id: '8m4-K-n8g-w', title: 'Python Tutorial For Beginners in Hindi', views: '9.7M', age: '1 year ago', duration: '10:53:55' },
    ]
  },
  'vj-channel': {
    name: 'Vedantu JEE', teacher: 'Pulkitt Jain', avatar: 'https://placehold.co/100x100/F97316/FFFFFF?text=PJ',
    bannerImage: 'https://placehold.co/1200x300/F97316/FFFFFF?text=Vedantu+Banner',
    teacherBio: 'Pulkitt Jain specializes in Organic Chemistry, providing students with unique tricks for JEE.',
    subscriberCount: '2.1M',
    videoCount: 840,
    joinDate: 'Joined 15 Mar 2018',
    playlists: [],
    allVideos: [
      { id: 'B-ytM22a24A', title: 'Chapter 1: General Organic Chemistry', views: '2.1M', age: '1 year ago', duration: '45:10' },
    ]
  },
  'am-channel': {
    name: 'Dr. Anand Mani', teacher: 'Dr. Anand Mani', avatar: 'https://placehold.co/100x100/F472B6/FFFFFF?text=AM',
    bannerImage: 'https://placehold.co/1200x300/F472B6/FFFFFF?text=Anand+Mani+Banner',
    teacherBio: 'Dr. Anand Mani focuses on providing the best possible education for medical aspirants in India.',
    subscriberCount: '1.5M',
    videoCount: 950,
    joinDate: 'Joined 22 Jun 2017',
    playlists: [],
    allVideos: []
  }
};

