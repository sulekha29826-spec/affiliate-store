const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/categoryController');
const { authenticate, adminOnly } = require('../middleware/auth');

router.get('/', ctrl.getCategories);
router.get('/:slug/products', ctrl.getCategoryProducts);
router.post('/', authenticate, adminOnly, ctrl.createCategory);
router.patch('/:id', authenticate, adminOnly, ctrl.updateCategory);
router.delete('/:id', authenticate, adminOnly, ctrl.deleteCategory);

module.exports = router;
