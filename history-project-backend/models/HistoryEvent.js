const mongoose = require('mongoose');

const historyEventSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  shortDescription: { type: String, required: true },
  longDescription: { type: String, required: true },
  date: { type: String, required: true },
  category: { type: String, required: true }
});

module.exports = mongoose.model('HistoryEvent', historyEventSchema);