const express = require('express');
const router = express.Router();

// TODO: Implement affiliate routes
router.get('/', (req, res) => {
  res.json({ success: true, message: 'affiliate route - coming soon' });
});

module.exports = router;
