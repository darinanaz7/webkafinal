// /models/Portfolio.js
const mongoose = require('mongoose');
const PortfolioSchema = new mongoose.Schema({
    title: String,
    description: String,
    images: [String],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
  });
  
  module.exports = mongoose.model('Portfolio', PortfolioSchema);