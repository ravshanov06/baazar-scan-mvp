const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop.controller');

/**
 * @route POST /api/shops/submit-prices
 * @desc Submit or update product prices for a vendor shop
 */
router.post('/submit-prices', shopController.submitPrices);

/**
 * @route POST /api/shops/login
 * @desc Vendor login via phone number, returns associated shops
 */
router.post('/login', shopController.login);

/**
 * @route POST /api/shops/register
 * @desc Register a new shop or update existing shop details
 */
router.post('/register', shopController.register);

/**
 * @route GET /api/shops/nearby
 * @desc Get nearby shops with optional product/category filtering and price coloring
 */
router.get('/nearby', shopController.getNearbyShops);

module.exports = router;
