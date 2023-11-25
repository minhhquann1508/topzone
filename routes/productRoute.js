const router = require('express').Router();
const {
    createProduct,
    getAllProduct,
    getSingleProduct,
    updateThumbnail,
    updateImages,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/verifyToken');
const uploader = require('../config/cloudinary.config');

router
    .route('/')
    .post([verifyToken, isAdmin], createProduct)
    .get(getAllProduct);

router
    .route('/updateThumbnail/:id')
    .put([verifyToken, isAdmin], uploader.single('thumbnail'), updateThumbnail);

router
    .route('/updateImages/:id')
    .put([verifyToken, isAdmin], uploader.array('images', 10), updateImages);

router
    .route('/:id')
    .put([verifyToken, isAdmin], updateProduct)
    .get(getSingleProduct)
    .delete([verifyToken, isAdmin], deleteProduct);



module.exports = router;
