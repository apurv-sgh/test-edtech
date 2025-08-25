const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');
const { 
  getMyCommunity, 
  createCommunity, 
  updateCommunity, 
  deleteCommunity,
  getCommunityDetails, // <-- Import new function
  getCommunityMessages, // <-- Import new function
  postMessage, // <-- Import new function
} = require('../controllers/communityController');

// Configure multer for logo uploads, ensuring the directory exists
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads/channels');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Define Routes
router.get('/my-community', authenticateToken, getMyCommunity);
router.post('/create', authenticateToken, upload.single('logo'), createCommunity);
router.put('/:communityId', authenticateToken, upload.single('logo'), updateCommunity);
router.delete('/:communityId', authenticateToken, deleteCommunity);

router.get('/:communityId', authenticateToken, getCommunityDetails);
router.get('/:communityId/messages', authenticateToken, getCommunityMessages);
router.post('/:communityId/messages', authenticateToken, upload.single('file'), postMessage);

module.exports = router;