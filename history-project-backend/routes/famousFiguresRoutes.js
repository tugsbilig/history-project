// backend/routes/famousFiguresRoutes.js
const express = require('express');
const router = express.Router();
const famousFiguresController = require('../controllers/famousFiguresController');

// Seed route (might want to protect this in production)
router.post('/seed', famousFiguresController.seedFamousFigures);

// Get all figures
router.get('/', famousFiguresController.getAllFigures);

// Get single figure
router.get('/:id', famousFiguresController.getFigureById);

module.exports = router;