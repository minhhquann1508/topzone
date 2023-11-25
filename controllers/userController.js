const User = require('../models/User');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/CustomError');

const ignoreKey = '-password -refreshToken -role -passwordChangeAt -passwordResetExpires -passwordResetToken -__v';

const getAllUser = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    const excludeFields = ['sort', 'page', 'limit', 'fields'];
    excludeFields.forEach(el => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, matchedEl => `$${matchedEl}`);
    const formatQueries = JSON.parse(queryString);

    if (queries?.firstname) formatQueries.firstname = { $regex: queries.firstname, $options: 'i' };
    let queryCommand = User.find(formatQueries);

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }

    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }

    //pagination
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const skip = (page - 1) * limit;

    const users = await queryCommand.skip(skip).limit(limit).select('-__v -password -refreshToken');
    const total = await User.find(formatQueries).countDocuments();
    res.status(200).json({
        users,
        total,
        currentPage: page,
        userPerPage: Number(limit)
    });
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const user = await User
        .findById(userId)
        .select(ignoreKey);
    if (!user) throw new CustomError('Người dùng không tồn tại', 404);
    res.status(200).json({ user });
});

const getSingleUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).select('-__v -password -refreshToken');
    if (!user) throw new CustomError('Người dùng không tồn tại', 404);
    res.status(200).json({ user });
});

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, phone, address } = req.body;
    if (!firstname || !lastname || !phone || !address) throw new CustomError('Vui lòng cung cấp đầy đủ các thông tin', 400);
    const user = await User
        .findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        .select(ignoreKey);
    if (!user) throw new CustomError('Cập nhật người dùng thất bại', 400);
    res.status(200).json({ user });
});

const uploadAvatar = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    if (!req.file) throw new CustomError('Không tìm thấy bất kì tệp nào', 400);
    if (!req.file.mimetype.startsWith('image')) throw new CustomError('Vui lòng cung cấp file ảnh', 400);
    const maxSize = 1024 * 1024;
    if (!req.file.size > maxSize) throw new CustomError('Dung lượng ảnh phải thấp hơn 1MB', 400);
    const user = await User.findByIdAndUpdate(userId, { avatar: req.file.path }, { new: true });
    if (!user) throw new CustomError('Cập nhật hình ảnh thất bại', 400);
    res.status(200).json({
        msg: 'Cập nhật hình ảnh thành công',
        user
    });
});

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new Error('Xóa người dùng không thành công', 400);
    res.status(200).json({
        msg: 'Xóa người dùng thành công',
    });
});

const updateCart = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const { productId, quantity } = req.body;
    if (!productId || !quantity) throw new CustomError('Vui lòng cung cấp mã sản phẩm và số lượng', 400);
    const user = await User.findById(userId);
    const product = await Product.findById(productId);
    const alreadyProduct = user?.cart.find(el => el.product.toString() === productId);
    if (alreadyProduct) {
        const response = await User
            .findOneAndUpdate(
                { cart: { $elemMatch: alreadyProduct } },
                { $set: { 'cart.$.quantity': quantity } },
                { new: true }
            )
        res
            .status(200)
            .json({ msg: response ? 'Thêm vào giỏ hàng thành công' : 'Thêm vào giỏ hàng thất bại' })
    } else {
        const response = await User
            .findByIdAndUpdate(
                userId,
                { $push: { cart: { product: productId, quantity, title: product.title, price: product.price, thumbnail: product.thumbnail } } },
                { new: true }
            );
        res
            .status(200)
            .json({ msg: response ? 'Thêm vào giỏ hàng thành công' : 'Thêm vào giỏ hàng thất bại' })
    }
});

module.exports = {
    getAllUser,
    getCurrentUser,
    getSingleUser,
    updateUser,
    uploadAvatar,
    deleteUser,
    updateCart
};

