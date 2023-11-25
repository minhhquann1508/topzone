const Review = require('../models/Review');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/CustomError');

const createReview = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const { product } = req.body;
    if (!product) throw new CustomError('Vui lòng cung cấp id sản phẩm', 400);
    const isAlreadyComment = await Review.findOne({ createdBy: userId, product });
    // if (isAlreadyComment) throw new CustomError('Bạn đã đánh giá sản phẩm này rồi', 400);
    const review = await Review.create({ ...req.body, createdBy: userId });
    res.status(201).json({ review });
});

const getProductReviews = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const reviews = await Product.findById(productId).populate('reviews')
    res.status(200).json({ reviews: reviews.reviews });
});

const getSingleReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    res.status(200).json({ review });
});

const updateReview = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { star, comment } = req.body;
    if (!star || !comment) throw new CustomError('Vui lòng cung cấp đủ thông tin', 400);
    const review = await Review.findById(id);
    if (review.createdBy.toString() !== req.user.userId) throw new CustomError('Bạn không được phép thực hiện việc này', 401)
    review.star = star;
    review.comment = comment;
    await review.save();
    res.status(200).json({ review });
});

const deleteReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) throw new CustomError('Không tìm thấy bình luận phù hợp', 400);
    await review.deleteOne();
    res.status(200).json({ msg: 'Xóa đánh giá thành công' });
});

module.exports = {
    createReview,
    getProductReviews,
    getSingleReview,
    updateReview,
    deleteReview
};