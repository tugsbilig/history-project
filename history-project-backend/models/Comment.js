const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

// Get comments for an event
router.get('/:eventId', async (req, res) => {
  try {
    const comments = await Comment.find({ eventId: req.params.eventId })
      .populate('author', 'name email image')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a comment
router.post('/', auth, async (req, res) => {
  try {
    const comment = new Comment({
      text: req.body.text,
      eventId: req.body.eventId,
      author: req.user.id
    });
    
    const savedComment = await comment.save();
    const populatedComment = await Comment.findById(savedComment._id)
      .populate('author', 'name email image');
      
    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;