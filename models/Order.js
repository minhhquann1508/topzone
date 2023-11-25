const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Cung cấp id sản phẩm']
        },
        title: {
            type: String,
            required: [true, 'Cung cấp tên sản phẩm']
        },
        quantity: {
            type: Number,
            required: [true, 'Cung cấp số lượng sản phẩm']
        },
        price: {
            type: Number,
            required: [true, 'Cung cấp đơn giá sản phẩm']
        },
        thumbnail: String
    }],
    status: {
        type: String,
        default: 'Đang xử lý',
        enum: ['Đã hủy', 'Đang xử lý', 'Đang vận chuyển', 'Đã giao']
    },
    orderBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    total: Number,
    coupon: {
        type: mongoose.Types.ObjectId,
        ref: 'Coupon'
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);