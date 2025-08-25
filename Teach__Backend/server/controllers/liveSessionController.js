const LiveSession = require('../models/LiveSession');

// @desc    Get live sessions (filtered by role)
// @route   GET /api/live-sessions
// @access  Private
exports.getSessions = async (req, res) => {
  try {
    let sessions;
    if (req.user.role === 'teacher') {
      sessions = await LiveSession.find({ instructor: req.user.id }).sort({ scheduledTime: 'asc' });
    } else {
      sessions = await LiveSession.find({ scheduledTime: { $gte: new Date() } }).sort({ scheduledTime: 'asc' });
    }
    // The frontend expects this structure. This is correct.
    res.status(200).json({ sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Server error while fetching sessions.' });
  }
};

// @desc    Create a new live session
// @route   POST /api/live-sessions
// @access  Private (Teacher only)
exports.createSession = async (req, res) => {
  // We only need title from the body now for the session's name.
  const { title, description, scheduledTime, roomId } = req.body;

  // Simplified validation
  if (!title || !scheduledTime || !roomId) {
    return res.status(400).json({ message: 'Please provide title, scheduledTime, and roomId.' });
  }

  try {
    const newSession = new LiveSession({
      title,
      description,
      scheduledTime,
      roomId,
      instructor: req.user.id,
      instructorName: req.user.name
    });

    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (error) {
    console.error('Error creating session:', error);
    // Provide more specific error for unique roomId conflict
    if (error.code === 11000) {
        return res.status(409).json({ message: 'A session with this Room ID already exists.'});
    }
    res.status(500).json({ message: 'Server error while creating session.' });
  }
};

// @desc    Update a live session
// @route   PUT /api/live-sessions/:id
// @access  Private (Teacher only)
exports.updateSession = async (req, res) => {
  // Use the simplified 'title' field
  const { title, description, scheduledTime } = req.body;

  try {
    const session = await LiveSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    // if (session.instructor.toString() !== req.user.id) {
    //   return res.status(403).json({ message: 'User not authorized to update this session.' });
    // }

    session.title = title || session.title;
    session.description = description === undefined ? session.description : description; // Allow clearing description
    session.scheduledTime = scheduledTime || session.scheduledTime;

    const updatedSession = await session.save();
    res.status(200).json(updatedSession);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ message: 'Server error while updating session.' });
  }
};

// The deleteSession controller can remain as it is, it's correct.
exports.deleteSession = async (req, res) => {
    // ... same code as before ...
    try {
        const session = await LiveSession.findById(req.params.id);
        if (!session) return res.status(404).json({ message: 'Session not found.' });
        // if (session.instructor.toString() !== req.user.id) return res.status(403).json({ message: 'User not authorized to delete this session.' });
        await session.deleteOne();
        res.status(200).json({ message: 'Session deleted successfully.' });
    } catch (error) {
        console.error('Error deleting session:', error);
        res.status(500).json({ message: 'Server error while deleting session.' });
    }
};