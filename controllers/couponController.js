const Coupon = require('../models/Coupon');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/CustomError');

const createCoupon = asyncHandler(async (req, res) => {
    const expires = Date.now() + 30 * 24 * 60 * 60 * 1000;
    const coupon = await Coupon.create({ ...req.body, expires });
    res.status(201).json({ coupon });
});

const getAllCoupon = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({});
    res.status(200).json({ coupons });
});

const getSingleCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    res.status(200).json({ coupon });
});

const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    res.status(200).json({ coupon });
});

const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    res.status(200).json({ msg: coupon ? 'Xóa coupon thành công' : 'Xóa coupon thất bại' });
});

module.exports = {
    createCoupon,
    getAllCoupon,
    getSingleCoupon,
    updateCoupon,
    deleteCoupon
};