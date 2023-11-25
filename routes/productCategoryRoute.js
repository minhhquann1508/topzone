const router = require('express').Router();
const {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/productCategoryController');
const { verifyToken, isAdmin } = require('../middleware/verifyToken');
const uploader = require('../config/cloudinary.config');

router
    .route('/')
    .post([verifyToken, isAdmin], createCategory)
    .get(getAllCategories);

router
    .route('/:id')
    .put([verifyToken, isAdmin], updateCategory)
    .get(getSingleCategory)
    .delete([verifyToken, isAdmin], deleteCategory);



module.exports = router;
