const mongoose = require('mongoose');

const scanResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  prediction: {
    type: String,
    enum: ['phishing', 'legitimate'],
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 100
  },
  suspiciousFeatures: [{
    type: String
  }],
  features: {
    type: mongoose.Schema.Types.Mixed
  },
  scannedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for faster queries
scanResultSchema.index({ userId: 1, scannedAt: -1 });

module.exports = mongoose.model('ScanResult', scanResultSchema);
