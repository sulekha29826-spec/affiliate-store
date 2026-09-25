const express = require('express');
const router = express.Router();

// TODO: Implement products routes
router.get('/', (req, res) => {
  res.json({ success: true, message: 'products route - coming soon' });
});

module.exports = router;
