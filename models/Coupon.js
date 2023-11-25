const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tên mã giảm giá không được bỏ trống']
    },
    discount: {
        type: Number,
        required: [true, 'Giá trị mã giảm không được bỏ trống']
    },
    expires: {
        type: Date,
        required: [true, 'Thời hạn mã giảm không được để trống']
    }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', CouponSchema);