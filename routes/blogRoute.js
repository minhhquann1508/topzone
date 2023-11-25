const router = require('express').Router();
const { verifyToken, isAdmin } = require('../middleware/verifyToken');
const {
    createBlog,
    getAllBlog,
    getSingleBlog,
    updateBlog,
    uploadBlogThumbnail,
    deleteBlog
} = require('../controllers/blogController');
const uploader = require('../config/cloudinary.config');

router
    .route('/')
    .post([verifyToken, isAdmin], createBlog)
    .get(getAllBlog);

router
    .route('/uploadThumbnail/:id')
    .put([verifyToken, isAdmin], uploader.single('thumbnail'), uploadBlogThumbnail)

router
    .route('/:id')
    .put([verifyToken, isAdmin], updateBlog)
    .delete([verifyToken, isAdmin], deleteBlog)
    .get(getSingleBlog);

module.exports = router;