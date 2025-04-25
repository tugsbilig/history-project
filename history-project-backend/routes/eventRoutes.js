const express = require('express');
const router = express.Router();
const Event = require('../models/HistoryEvent');

router.post('/', async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/', async (req, res) => {
  try {
      const events = await Event.find();
      res.json(events);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

module.exports = router;
