const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const ScanResult = require('../models/ScanResult');

// GET /api/dashboard/stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const [totalScans, phishingCount, legitimateCount, recentScans] = await Promise.all([
      ScanResult.countDocuments({ userId }),
      ScanResult.countDocuments({ userId, prediction: 'phishing' }),
      ScanResult.countDocuments({ userId, prediction: 'legitimate' }),
      ScanResult.find({ userId })
        .sort({ scannedAt: -1 })
        .limit(10)
        .select('url prediction confidence riskScore scannedAt')
    ]);

    // Weekly scan data (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyData = await ScanResult.aggregate([
      {
        $match: {
          userId: userId,
          scannedAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$scannedAt' } },
            prediction: '$prediction'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Format weekly data for chart
    const chartData = {};
    weeklyData.forEach(item => {
      if (!chartData[item._id.date]) {
        chartData[item._id.date] = { date: item._id.date, phishing: 0, legitimate: 0 };
      }
      chartData[item._id.date][item._id.prediction] = item.count;
    });

    res.json({
      stats: {
        totalScans,
        phishingDetected: phishingCount,
        legitimateDetected: legitimateCount,
        phishingRate: totalScans > 0 ? Math.round((phishingCount / totalScans) * 100) : 0
      },
      recentScans,
      weeklyChart: Object.values(chartData)
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats.' });
  }
});

module.exports = router;
