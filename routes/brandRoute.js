const router = require('express').Router();
const {
    createBrand,
    getAllBrand,
    getSingleBrand,
    updateBrand,
    uploadBrandLogo,
    deleteBrand
} = require('../controllers/brandController');
const { verifyToken, isAdmin } = require('../middleware/verifyToken');
const uploader = require('../config/cloudinary.config');

router
    .route('/')
    .get(getAllBrand)
    .post([verifyToken, isAdmin], createBrand);

router
    .route('/uploadLogo/:id')
    .put([verifyToken, isAdmin], uploader.single('logo'), uploadBrandLogo);

router
    .route('/:id')
    .get(getSingleBrand)
    .put([verifyToken, isAdmin], updateBrand)
    .delete([verifyToken, isAdmin], deleteBrand);

module.exports = router;