// backend/models/FamousFigure.js
const mongoose = require('mongoose');

const famousFigureSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  lifespan: String,
  achievements: [String]
});

module.exports = mongoose.model('FamousFigure', famousFigureSchema);