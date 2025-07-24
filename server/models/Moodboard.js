const mongoose = require('mongoose');

const MoodboardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  theme: { type: String, required: true },
  genre: { type: String, required: true },
  tone: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  colors: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Moodboard', MoodboardSchema);
