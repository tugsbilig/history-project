const HistoryEvent = require('../models/HistoryEvent');

// Initial data (same as your historyEvents.ts)
const initialEvents = [
  {
    id: 1,
    title: "Чингис хааны төрсөн өдөр",
    image: "/images/history7.jpg",
    shortDescription: "1162 онд Чингис хаан төрсөн...",
    longDescription: "1162 оны хавар, Онон голын эрэг дээр...",
    date: "1162 он",
    category: "Эзэнт гүрэн"
  },
  // Include all other events from your array
];

// Seed database with initial data
exports.seedHistoryEvents = async () => {
  try {
    await HistoryEvent.deleteMany();
    await HistoryEvent.insertMany(initialEvents);
    console.log('History events seeded successfully');
    return { success: true, message: 'Database seeded successfully' };
  } catch (error) {
    console.error('Error seeding history events:', error);
    throw error;
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await HistoryEvent.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await HistoryEvent.findOne({ id: req.params.id });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get events by category
exports.getEventsByCategory = async (req, res) => {
  try {
    const events = await HistoryEvent.find({ category: req.params.category });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};