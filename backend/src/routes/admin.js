const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adminController');
const { authenticate, adminOnly } = require('../middleware/auth');

router.use(authenticate, adminOnly);

router.get('/dashboard', ctrl.getDashboard);
router.get('/analytics', ctrl.getAnalytics);
router.get('/users', ctrl.getUsers);
router.patch('/users/:id', ctrl.updateUser);
router.get('/banners', ctrl.getBanners);
router.post('/banners', ctrl.createBanner);
router.patch('/banners/:id', ctrl.updateBanner);
router.delete('/banners/:id', ctrl.deleteBanner);
router.get('/deals', ctrl.getDeals);
router.post('/deals', ctrl.createDeal);
router.patch('/deals/:id', ctrl.updateDeal);
router.delete('/deals/:id', ctrl.deleteDeal);
router.get('/settings', ctrl.getSettings);
router.patch('/settings', ctrl.updateSettings);

module.exports = router;
