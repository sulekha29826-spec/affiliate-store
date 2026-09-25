const express = require('express');
const router = express.Router();

// TODO: Implement categories routes
router.get('/', (req, res) => {
  res.json({ success: true, message: 'categories route - coming soon' });
});

module.exports = router;
