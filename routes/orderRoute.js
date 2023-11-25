const router = require('express').Router();
const {
    createOrder,
    getAllOrder,
    getCurrentUserOrder,
    updateOrderStatus,
    deleteOrder
} = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middleware/verifyToken');

router
    .route('/')
    .post([verifyToken], createOrder)
    .get([verifyToken, isAdmin], getAllOrder);

router
    .route('/my-order')
    .get([verifyToken,], getCurrentUserOrder);

router
    .route('/:id')
    .put([verifyToken, isAdmin], updateOrderStatus)
    .delete([verifyToken], deleteOrder);

module.exports = router;