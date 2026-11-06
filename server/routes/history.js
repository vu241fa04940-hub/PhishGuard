const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const ScanResult = require('../models/ScanResult');

// GET /api/history - Get user's scan history
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const filter = req.query.filter; // 'phishing', 'legitimate', or undefined

    const query = { userId: req.user._id };
    if (filter && ['phishing', 'legitimate'].includes(filter)) {
      query.prediction = filter;
    }

    const [results, total] = await Promise.all([
      ScanResult.find(query)
        .sort({ scannedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('url prediction confidence riskScore scannedAt suspiciousFeatures'),
      ScanResult.countDocuments(query)
    ]);

    res.json({
      results,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch history.' });
  }
});

// DELETE /api/history/:id - Delete a specific scan
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const scan = await ScanResult.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!scan) {
      return res.status(404).json({ error: 'Scan record not found.' });
    }

    await ScanResult.deleteOne({ _id: req.params.id });
    res.json({ message: 'Scan record deleted successfully.' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete record.' });
  }
});

// DELETE /api/history - Delete all user history
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const result = await ScanResult.deleteMany({ userId: req.user._id });
    res.json({ 
      message: `Deleted ${result.deletedCount} scan records.`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Delete all error:', error);
    res.status(500).json({ error: 'Failed to clear history.' });
  }
});

module.exports = router;
