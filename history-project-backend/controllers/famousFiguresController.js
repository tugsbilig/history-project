// backend/controllers/famousFiguresController.js
const FamousFigure = require('../models/FamousFigure');

// Seed database with initial data
exports.seedFamousFigures = async () => {
  const figures = [
    { 
      id: 1, 
      name: "Чингис хаан", 
      image: "/images/genghis_khan.jpg", 
      description: "Чингис хаан (1162-1227) нь Монголын эзэнт гүрнийг үндэслэгч...",
      lifespan: "1162-1227",
      achievements: [
        "Монголын эзэнт гүрнийг үндэслэгч",
        "Нэгдсэн Монгол улсыг байгуулсан"
      ]
    },
    // Add all other figures here...
  ];

  try {
    await FamousFigure.deleteMany(); // Clear existing data
    await FamousFigure.insertMany(figures);
    console.log('Famous figures seeded successfully');
  } catch (error) {
    console.error('Error seeding famous figures:', error);
  }
};

// Get all famous figures
exports.getAllFigures = async (req, res) => {
  try {
    const figures = await FamousFigure.find();
    res.json(figures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single figure by ID
exports.getFigureById = async (req, res) => {
  try {
    const figure = await FamousFigure.findOne({ id: req.params.id });
    if (!figure) {
      return res.status(404).json({ message: 'Figure not found' });
    }
    res.json(figure);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};