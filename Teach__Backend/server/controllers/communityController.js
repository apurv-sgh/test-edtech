const asyncHandler = require('express-async-handler');
const Community = require('../models/Community');
const CommunityMessage = require('../models/CommunityMessage');

// @desc    Get all communities for the logged-in teacher
// @route   GET /api/community/my-community
exports.getMyCommunity = asyncHandler(async (req, res) => {
  const teacherId = req.user.teacherId || req.user.userId; // Use the ID from your auth middleware
  const communities = await Community.find({ teacher: teacherId });
  res.json({ success: true, channels: communities }); // Send back 'channels' as the frontend expects
});

// @desc    Create a new community
// @route   POST /api/community/create
exports.createCommunity = asyncHandler(async (req, res) => {
  const { name, category, team, bio } = req.body;
  const teacherId = req.user.teacherId || req.user.userId;
  
  const logo = req.file ? `/uploads/channels/${req.file.filename}` : null;

  const community = new Community({ teacher: teacherId, name, category, team, bio, logo });
  await community.save();
  
  res.status(201).json({ success: true, message: 'Community created', channel: community });
});

// @desc    Update a community
// @route   PUT /api/community/:communityId
exports.updateCommunity = asyncHandler(async (req, res) => {
    const { communityId } = req.params;
    const { name, category, team, bio } = req.body;
    const teacherId = req.user.teacherId || req.user.userId;
    
    const community = await Community.findOne({ _id: communityId, teacher: teacherId });
    if (!community) {
        return res.status(404).json({ message: 'Community not found or not authorized' });
    }

    community.name = name || community.name;
    community.category = category || community.category;
    community.team = team || community.team;
    community.bio = bio || community.bio;

    if (req.file) {
        community.logo = `/uploads/channels/${req.file.filename}`;
    }

    await community.save();
    res.json({ success: true, message: 'Community updated', channel: community });
});

// @desc    Delete a community
// @route   DELETE /api/community/:communityId
exports.deleteCommunity = asyncHandler(async (req, res) => {
    const { communityId } = req.params;
    const teacherId = req.user.teacherId || req.user.userId;

    const community = await Community.findOneAndDelete({ _id: communityId, teacher: teacherId });
    if (!community) {
        return res.status(404).json({ message: 'Community not found or not authorized' });
    }
    // Optional: Add logic here to delete the logo file from the 'uploads' folder
    res.json({ success: true, message: 'Community deleted successfully' });
});

// @desc    Get a single community's details
// @route   GET /api/community/:communityId
exports.getCommunityDetails = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.communityId);
  if (!community) {
    return res.status(404).json({ message: 'Community not found' });
  }
  res.json({ success: true, community });
});

// @desc    Get all messages for a community
// @route   GET /api/community/:communityId/messages
exports.getCommunityMessages = asyncHandler(async (req, res) => {
  const messages = await CommunityMessage.find({ community: req.params.communityId }).sort('createdAt');
  res.json({ success: true, messages });
});

// @desc    Post a new message to a community
// @route   POST /api/community/:communityId/messages
exports.postMessage = asyncHandler(async (req, res) => {
    const { messageType, content } = req.body;
    const teacherId = req.user.teacherId || req.user.userId;

    let messagePayload = {
        community: req.params.communityId,
        sender: teacherId,
        senderName: req.user.name,
        messageType,
    };

    if (messageType === 'text') {
        messagePayload.content = content;
    } else if (req.file) { // For 'note' or 'video'
        messagePayload.file = {
            originalName: req.file.originalname,
            url: `/uploads/community/${req.file.filename}`,
            fileType: req.file.mimetype,
            size: req.file.size,
        };
    }

    const message = new CommunityMessage(messagePayload);
    await message.save();
    res.status(201).json({ success: true, message });
});