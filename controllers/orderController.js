const Order = require('../models/Order');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/CustomError');

// const createOrder = asyncHandler(async (req, res) => {
//     const { userId } = req.user;
//     const { coupon } = req.body;
//     const userCart = await User
//         .findById(userId)
//         .select('cart')
//         .populate('cart.product', 'title price');
//     const products = userCart?.cart.map(el => ({
//         product: el.product._id,
//         quantity: el.quantity,
//         price: el.price,
//         thumbnail: el.thumbnail
//     }));
//     let total = userCart?.cart.reduce((sum, el) => sum + el.product.price * el.quantity, 0);
//     if (coupon) {
//         const selectedCoupon = await Coupon.findById(coupon);
//         total = total - (total * selectedCoupon?.discount / 100) || total;
//     }
//     const result = await Order.create({
//         products,
//         total,
//         coupon,
//         orderBy: userId
//     });
//     res.status(200).json({ result });
// });

const createOrder = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const { products, coupon } = req.body;
    if (!products || products.length < 1) throw new CustomError('Vui lòng cung cấp sản phẩm', 400);
    let total = products.reduce((sum, el) => sum + el.price * el.quantity, 0);
    if (coupon) {
        const isCouponValid = await Coupon
            .findOne({ _id: coupon, expires: { $gte: new Date() } });
        if (!isCouponValid) throw new CustomError('Mã giảm giá không hợp lệ', 400);
        total = total - (total * isCouponValid?.discount / 100) || total;
    }
    const order = await Order.create({
        products,
        coupon,
        orderBy: userId,
        total
    });
    res.status(201).json({ order });
});

const getAllOrder = asyncHandler(async (req, res) => {
    const orders = await Order.find({});
    res.status(200).json({ orders });
});

const getCurrentUserOrder = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const order = await Order.find({ orderBy: userId });
    res.status(200).json({ order });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    if (!status) throw new CustomError('Cung cấp trạng thái đơn hàng', 400);
    const order = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );
    res.status(200).json({ order });
});

const deleteOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    res.status(200).json({ msg: order ? 'Xóa đơn hàng thành công' : 'Xóa đơn hàng thất bại' });
});

module.exports = {
    createOrder,
    getAllOrder,
    getCurrentUserOrder,
    updateOrderStatus,
    deleteOrder
};
