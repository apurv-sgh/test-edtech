const Channel = require('../models/Channel');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

// Get all channels with filters
const getAllChannels = async (req, res) => {
    try {
        const { 
            subject, 
            instructor, 
            level, 
            search, 
            page = 1, 
            limit = 20,
            tags 
        } = req.query;

        const query = { isActive: true, isPublic: true };

        // Apply filters
        if (subject) {
            query.subject = { $regex: subject, $options: 'i' };
        }

        if (instructor) {
            query.instructor = instructor;
        }

        if (level && level !== 'All Levels') {
            query.level = level;
        }

        if (tags) {
            query.tags = { $in: tags.split(',') };
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;

        const channels = await Channel.find(query)
            .populate('instructor', 'name email avatar')
            .populate('members.user', 'name email avatar')
            .sort({ memberCount: -1, createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select('-messages');

        const total = await Channel.countDocuments(query);

        res.json({
            channels,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                hasNext: skip + channels.length < total,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching channels:', error);
        res.status(500).json({ message: 'Error fetching channels' });
    }
};

// Get channel by ID
const getChannelById = async (req, res) => {
    try {
        const { id } = req.params;
        const channel = await Channel.findById(id)
            .populate('instructor', 'name email avatar')
            .populate('members.user', 'name email avatar')
            .populate('messages.sender', 'name email avatar');

        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        res.json(channel);
    } catch (error) {
        console.error('Error fetching channel:', error);
        res.status(500).json({ message: 'Error fetching channel' });
    }
};

// Create a new channel (for teachers)
const createChannel = async (req, res) => {
    try {
        const { name, description, subject, tags, level } = req.body;
        const instructorId = req.user.id;

        // Check if teacher exists
        const teacher = await Teacher.findById(instructorId);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        const channel = new Channel({
            name,
            description,
            subject,
            instructor: instructorId,
            tags: tags || [],
            level: level || 'All Levels',
            members: [{
                user: instructorId,
                userType: 'Teacher',
                role: 'admin'
            }]
        });

        await channel.save();

        const populatedChannel = await Channel.findById(channel._id)
            .populate('instructor', 'name email avatar')
            .populate('members.user', 'name email avatar');

        res.status(201).json(populatedChannel);
    } catch (error) {
        console.error('Error creating channel:', error);
        res.status(500).json({ message: 'Error creating channel' });
    }
};

// Join a channel
const joinChannel = async (req, res) => {
    try {
        const { channelId } = req.params;
        const userId = req.user._id || req.user.id;
        
        // Since authMiddleware only checks Student model, we'll assume all users are students for now
        const userType = 'Student';

        console.log('Joining channel:', { channelId, userId, userType }); // Debug log

        // Validate channelId format
        if (!channelId || channelId.length !== 24) {
            return res.status(400).json({ message: 'Invalid channel ID format' });
        }

        const channel = await Channel.findById(channelId);
        console.log('Channel found:', channel ? 'Yes' : 'No'); // Debug log
        
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        console.log('Channel members:', channel.members); // Debug log

        // Check if user is already a member
        const isMember = channel.members.some(member => 
            member.user.toString() === userId.toString() && member.userType === userType
        );

        console.log('Is member:', isMember); // Debug log

        if (isMember) {
            return res.status(400).json({ message: 'Already a member of this channel' });
        }

        // Add user to channel
        const newMember = {
            user: userId,
            userType,
            role: 'member'
        };
        
        console.log('Adding new member:', newMember); // Debug log
        
        channel.members.push(newMember);

        await channel.save();
        console.log('Channel saved successfully'); // Debug log

        res.json({ message: 'Successfully joined channel' });
    } catch (error) {
        console.error('Error joining channel:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            message: 'Error joining channel', 
            error: error.message,
            stack: error.stack 
        });
    }
};

// Leave a channel
const leaveChannel = async (req, res) => {
    try {
        const { channelId } = req.params;
        const userId = req.user._id || req.user.id;
        const userType = 'Student'; // Since authMiddleware only checks Student model

        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        // Check if user is a member
        const memberIndex = channel.members.findIndex(member => 
            member.user.toString() === userId.toString() && member.userType === userType
        );

        if (memberIndex === -1) {
            return res.status(400).json({ message: 'Not a member of this channel' });
        }

        // Remove user from channel
        channel.members.splice(memberIndex, 1);
        await channel.save();

        res.json({ message: 'Successfully left channel' });
    } catch (error) {
        console.error('Error leaving channel:', error);
        res.status(500).json({ message: 'Error leaving channel' });
    }
};

// Get user's joined channels
const getMyChannels = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const userType = 'Student'; // Since authMiddleware only checks Student model

        const channels = await Channel.find({
            'members.user': userId,
            'members.userType': userType,
            isActive: true
        })
        .populate('instructor', 'name email avatar')
        .populate('lastMessage.sender', 'name email avatar')
        .sort({ 'lastMessage.createdAt': -1, createdAt: -1 })
        .select('-messages');

        res.json(channels);
    } catch (error) {
        console.error('Error fetching user channels:', error);
        res.status(500).json({ message: 'Error fetching user channels' });
    }
};

// Send message to channel
const sendMessage = async (req, res) => {
    try {
        const { channelId } = req.params;
        const { content, messageType = 'text', attachments = [] } = req.body;
        const userId = req.user._id || req.user.id;
        const userType = 'Student'; // Since authMiddleware only checks Student model

        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        // Check if user is a member
        const isMember = channel.members.some(member => 
            member.user.toString() === userId.toString() && member.userType === userType
        );

        if (!isMember) {
            return res.status(403).json({ message: 'Not a member of this channel' });
        }

        const message = {
            sender: userId,
            senderType: userType,
            content,
            messageType,
            attachments
        };

        channel.messages.push(message);
        channel.lastMessage = message;
        await channel.save();

        const populatedMessage = await Channel.findById(channelId)
            .populate('messages.sender', 'name email avatar')
            .then(ch => ch.messages[ch.messages.length - 1]);

        res.json(populatedMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message' });
    }
};

// Get channel messages
const getChannelMessages = async (req, res) => {
    try {
        const { channelId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        const userId = req.user._id || req.user.id;
        const userType = 'Student'; // Since authMiddleware only checks Student model

        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        // Check if user is a member
        const isMember = channel.members.some(member => 
            member.user.toString() === userId.toString() && member.userType === userType
        );

        if (!isMember) {
            return res.status(403).json({ message: 'Not a member of this channel' });
        }

        const skip = (page - 1) * limit;
        const messages = channel.messages
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(skip, skip + parseInt(limit))
            .reverse();

        // Populate sender information
        const populatedMessages = await Channel.populate(messages, {
            path: 'sender',
            select: 'name email avatar'
        });

        res.json({
            messages: populatedMessages,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(channel.messages.length / limit),
                hasNext: skip + messages.length < channel.messages.length,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching channel messages:', error);
        res.status(500).json({ message: 'Error fetching channel messages' });
    }
};

// Get available subjects
const getSubjects = async (req, res) => {
    try {
        const subjects = await Channel.distinct('subject', { isActive: true });
        res.json(subjects.sort());
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ message: 'Error fetching subjects' });
    }
};

// Get available tags
const getTags = async (req, res) => {
    try {
        const tags = await Channel.distinct('tags', { isActive: true });
        res.json(tags.sort());
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({ message: 'Error fetching tags' });
    }
};

// Test endpoint to check channels
const testChannels = async (req, res) => {
    try {
        const channels = await Channel.find({}).limit(5);
        console.log('Found channels:', channels.length);
        res.json({ 
            message: 'Test successful', 
            channelCount: channels.length,
            channels: channels.map(ch => ({ id: ch._id, name: ch.name }))
        });
    } catch (error) {
        console.error('Test error:', error);
        res.status(500).json({ message: 'Test failed', error: error.message });
    }
};

module.exports = {
    getAllChannels,
    getChannelById,
    createChannel,
    joinChannel,
    leaveChannel,
    getMyChannels,
    sendMessage,
    getChannelMessages,
    getSubjects,
    getTags,
    testChannels
}; 