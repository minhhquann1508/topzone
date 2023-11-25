const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tên sản phẩm không được để trống']
    },
    slug: String,
    desc: {
        type: String,
        required: [true, 'Mô tả sản phẩm không được để trống']
    },
    totalViews: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'Giá sản phẩm không được để trống']
    },
    brand: {
        type: mongoose.Types.ObjectId,
        ref: 'Brand',
        required: [true, 'Thương hiệu sản phẩm không được để trống']
    },
    color: {
        type: String,
        enum: ['Đen', 'Trắng', 'Hồng', 'Vàng Gold', 'Đỏ', 'Xanh lá', 'Xanh dương']
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'ProductCategory',
        required: [true, 'Danh mục sản phẩm không được để trống']
    },
    sold: {
        type: Number,
        default: 0
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    thumbnail: String,
    images: Array,
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Người tạo sản phẩm không được để trống']
    }
}, { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true }, });

ProductSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false
})

module.exports = mongoose.model('Product', ProductSchema);