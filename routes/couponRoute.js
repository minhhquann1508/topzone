const router = require('express').Router();
const {
    createCoupon,
    getAllCoupon,
    getSingleCoupon,
    updateCoupon,
    deleteCoupon
} = require('../controllers/couponController');
const { verifyToken, isAdmin } = require('../middleware/verifyToken');

router
    .route('/')
    .get([verifyToken, isAdmin], getAllCoupon)
    .post([verifyToken, isAdmin], createCoupon);

router
    .route('/:id')
    .get([verifyToken, isAdmin], getSingleCoupon)
    .put([verifyToken, isAdmin], updateCoupon)
    .delete([verifyToken, isAdmin], deleteCoupon);

module.exports = router;