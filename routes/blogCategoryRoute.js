const router = require('express').Router();
const { verifyToken, isAdmin } = require('../middleware/verifyToken');
const {
    createBlogCategory,
    getAllBlogCategories,
    getSingleBlogCategory,
    updateBlogCategory,
    deleteBlogCategory
} = require('../controllers/blogCategoryController');

router
    .route('/')
    .post([verifyToken, isAdmin], createBlogCategory)
    .get(getAllBlogCategories);

router
    .route('/:id')
    .put([verifyToken, isAdmin], updateBlogCategory)
    .delete([verifyToken, isAdmin], deleteBlogCategory)
    .get(getSingleBlogCategory);

module.exports = router;