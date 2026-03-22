const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: { type: String },
  userName: { type: String, default: 'Anonyme' },
  rating: {
    type: Number, required: true,
    min: 1, max: 5
  },
  comment: { type: String, default: '' },
  appVersion: {
    type: String, default: '1.0.0'
  },
}, { timestamps: true });

module.exports =
  mongoose.model('Review', reviewSchema);
