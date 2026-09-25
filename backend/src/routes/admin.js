const express = require('express');
const router = express.Router();

// TODO: Implement admin routes
router.get('/', (req, res) => {
  res.json({ success: true, message: 'admin route - coming soon' });
});

module.exports = router;
