const mongoose = require('mongoose');

const moodboardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  theme: String,
  genre: String,
  tone: String,
  description: String,
  imageUrl: String,
  colors: [String],
}, { timestamps: true });

module.exports = mongoose.model('Moodboard', moodboardSchema);
