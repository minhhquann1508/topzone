const router = require('express').Router();
const {
    getAllUser,
    getCurrentUser,
    getSingleUser,
    updateUser,
    uploadAvatar,
    deleteUser,
    updateCart
} = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/verifyToken');
const uploader = require('../config/cloudinary.config');

router
    .route('/')
    .get([verifyToken, isAdmin], getAllUser);

router
    .route('/updateCart')
    .put([verifyToken], updateCart);

router
    .route('/showMe')
    .get([verifyToken], getCurrentUser);

router
    .route('/uploadAvatar')
    .put(verifyToken, uploader.single('avatar'), uploadAvatar);

router
    .route('/:id')
    .get([verifyToken, isAdmin], getSingleUser)
    .put([verifyToken], updateUser)
    .delete([verifyToken, isAdmin], deleteUser);


module.exports = router;
