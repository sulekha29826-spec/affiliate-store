const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/merchantController');
const { authenticate, adminOnly } = require('../middleware/auth');

router.get('/', ctrl.getMerchants);
router.post('/', authenticate, adminOnly, ctrl.createMerchant);
router.patch('/:id', authenticate, adminOnly, ctrl.updateMerchant);
router.delete('/:id', authenticate, adminOnly, ctrl.deleteMerchant);

module.exports = router;
