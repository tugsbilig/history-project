const express = require('express');
const router = express.Router();
const historyEventsController = require('../controllers/historyEventsController');

// Seed route (for development)
router.post('/seed', historyEventsController.seedHistoryEvents);

// Get all events
router.get('/', historyEventsController.getAllEvents);

// Get single event
router.get('/:id', historyEventsController.getEventById);

// Get events by category
router.get('/category/:category', historyEventsController.getEventsByCategory);

module.exports = router;