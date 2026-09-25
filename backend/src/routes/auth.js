const express = require('express');
const router = express.Router();

// TODO: Implement auth routes
router.get('/', (req, res) => {
  res.json({ success: true, message: 'auth route - coming soon' });
});

module.exports = router;
