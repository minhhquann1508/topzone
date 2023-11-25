const router = require('express').Router();
const {
    createReview,
    getProductReviews,
    getSingleReview,
    updateReview,
    deleteReview
} = require('../controllers/reviewController');
const { verifyToken, isAdmin } = require('../middleware/verifyToken');

router
    .route('/')
    .post(verifyToken, createReview);

router
    .route('/product-reviews/:productId')
    .get(getProductReviews);

router
    .route('/:id')
    .get(getSingleReview)
    .put(verifyToken, updateReview)
    .delete(verifyToken, deleteReview);

module.exports = router;