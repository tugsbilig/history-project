const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Event = require('../models/HistoryEvent');
const auth = require('../middleware/auth');

// Add comment
router.post('/', auth, async (req, res) => {
  try {
    const { content, eventId } = req.body;
    
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Create comment
    const comment = new Comment({
      content,
      user: req.user.id,
      event: eventId
    });

    await comment.save();
    
    // Populate user info
    await comment.populate('user', 'username');
    
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get comments for an event
router.get('/:eventId', async (req, res) => {

  try {
    const comments = await Comment.find({ event: req.params.eventId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
      
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;