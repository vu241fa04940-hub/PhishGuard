const express = require('express');
const router = express.Router();
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const ScanResult = require('../models/ScanResult');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

// POST /api/scan
router.post('/', authMiddleware, [
  body('url').notEmpty().withMessage('URL is required').trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { url } = req.body;
    
    // Add scheme if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // Call Python ML service
    let mlResult;
    try {
      const response = await axios.post(`${ML_SERVICE_URL}/api/predict`, { url }, {
        timeout: 15000,
        headers: { 'Content-Type': 'application/json' }
      });
      mlResult = response.data;
    } catch (mlError) {
      console.error('ML service error:', mlError.message);
      
      if (mlError.code === 'ECONNREFUSED') {
        return res.status(503).json({ 
          error: 'ML service is not running. Please start the Python Flask service (ml-service/app.py).' 
        });
      }
      
      return res.status(502).json({ 
        error: 'ML analysis failed. Please try again.',
        details: mlError.response?.data?.error || mlError.message
      });
    }

    // Save result to MongoDB
    const scanResult = new ScanResult({
      userId: req.user._id,
      url: mlResult.url || url,
      prediction: mlResult.prediction,
      confidence: mlResult.confidence,
      riskScore: mlResult.risk_score,
      suspiciousFeatures: mlResult.suspicious_features || [],
      features: mlResult.features || {}
    });

    await scanResult.save();

    res.json({
      success: true,
      scanId: scanResult._id,
      url: mlResult.url || url,
      prediction: mlResult.prediction,
      confidence: mlResult.confidence,
      riskScore: mlResult.risk_score,
      suspiciousFeatures: mlResult.suspicious_features || [],
      features: mlResult.features || {},
      scannedAt: scanResult.scannedAt
    });
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Scan failed. Please try again.' });
  }
});

// POST /api/scan/guest - for unauthenticated preview (limited)
router.post('/guest', [
  body('url').notEmpty().withMessage('URL is required').trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { url } = req.body;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    let mlResult;
    try {
      const response = await axios.post(`${ML_SERVICE_URL}/api/predict`, { url }, {
        timeout: 15000
      });
      mlResult = response.data;
    } catch (mlError) {
      if (mlError.code === 'ECONNREFUSED') {
        return res.status(503).json({ 
          error: 'ML service is not running. Please start the Python Flask service.' 
        });
      }
      return res.status(502).json({ error: 'ML analysis failed. Please try again.' });
    }

    res.json({
      success: true,
      url: mlResult.url || url,
      prediction: mlResult.prediction,
      confidence: mlResult.confidence,
      riskScore: mlResult.risk_score,
      suspiciousFeatures: mlResult.suspicious_features || [],
      features: mlResult.features || {},
      note: 'Sign in to save your scan history'
    });
  } catch (error) {
    console.error('Guest scan error:', error);
    res.status(500).json({ error: 'Scan failed. Please try again.' });
  }
});

module.exports = router;
