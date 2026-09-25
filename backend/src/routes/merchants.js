const express = require('express');
const router = express.Router();

// TODO: Implement merchants routes
router.get('/', (req, res) => {
  res.json({ success: true, message: 'merchants route - coming soon' });
});

module.exports = router;
