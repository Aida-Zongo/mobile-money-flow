const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Gestion des avis et témoignages
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Soumettre un avis
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               userName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Avis enregistré
 *       400:
 *         description: Note invalide
 */
router.post('/', async (req, res) => {
  try {
    const { rating, comment, userName } =
      req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Note entre 1 et 5 requise'
      });
    }

    const review = await Review.create({
      userId: req.headers.authorization
        ? 'authenticated' : 'anonymous',
      userName: userName || 'Utilisateur',
      rating: Number(rating),
      comment: comment || '',
      appVersion: '1.0.0',
    });

    return res.status(201).json({
      success: true,
      message: 'Avis enregistré, merci !',
      review: {
        id: review._id.toString(),
        rating: review.rating,
        createdAt: review.createdAt,
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Récupérer les 50 derniers avis
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Liste des avis récupérée avec moyenne des notes
 */
router.get('/', async (req, res) => {
  try {
    const reviews = await Review
      .find()
      .sort({ createdAt: -1 })
      .limit(50);

    const avgRating = reviews.length > 0
      ? reviews.reduce(
          (sum, r) => sum + r.rating, 0
        ) / reviews.length
      : 0;

    return res.json({
      success: true,
      reviews,
      total: reviews.length,
      avgRating: Math.round(
        avgRating * 10) / 10,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
