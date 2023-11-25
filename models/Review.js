const mongoose = require('mongoose');
const Product = require('./Product');

const ReviewSchema = new mongoose.Schema({
    star: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    comment: {
        type: String,
        maxlength: [200, 'Đánh giá sản phẩm không vượt quá 200 ký tự']
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Người viết đánh giá không được bỏ trống']
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Sản phẩm được đánh giá không được bỏ trống']
    }
});

ReviewSchema.statics.calcAverageRating = async function (productId) {
    const result = await this.aggregate([
        {
            $match: { product: productId },
        },
        {
            $group: { _id: null, totalRatings: { $avg: '$star' } }
        }
    ]);
    try {
        await Product
            .findByIdAndUpdate(
                productId,
                { totalRatings: result[0]?.totalRatings || 0 },
                { new: true }
            )
    } catch (error) {
        console.log(error);
    }
};

ReviewSchema.post('save', async function (req, res) {
    await this.constructor.calcAverageRating(this.product);
});

ReviewSchema.post('deleteOne', { document: true }, async function (req, res) {
    await this.constructor.calcAverageRating(this.product);
});

module.exports = mongoose.model('Review', ReviewSchema);