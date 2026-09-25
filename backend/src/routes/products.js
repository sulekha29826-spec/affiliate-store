const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productController');
const { authenticate, adminOnly } = require('../middleware/auth');

router.get('/', ctrl.getProducts);
router.get('/featured', ctrl.getFeatured);
router.get('/trending', ctrl.getTrending);
router.get('/:slug', ctrl.getProductBySlug);
router.post('/', authenticate, adminOnly, ctrl.createProduct);
router.patch('/:id', authenticate, adminOnly, ctrl.updateProduct);
router.delete('/:id', authenticate, adminOnly, ctrl.deleteProduct);

module.exports = router;
