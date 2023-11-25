const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/CustomError');
const { generateAccessToken, generateRefreshToken } = require('../middleware/jwt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

const register = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const isEmailAlreadyRegistered = await User.findOne({ email });
    if (isEmailAlreadyRegistered)
        throw new CustomError('Email này đã được đăng ký', 400);

    const isFirstAccount = await User.countDocuments() === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    const user = await User.create({ ...req.body, role });
    res.status(201).json({ user: user ? 'Đăng ký tài khoản thành công' : 'Đăng ký tài khoản không thành công' });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new CustomError('Vui lòng cung cấp email và mật khẩu', 400);

    const user = await User.findOne({ email });
    if (!user) throw new CustomError('Người dùng không tồn tại', 400);
    const isPasswordCorrect = await user.isCorrectPassword(password);
    if (!isPasswordCorrect) throw new CustomError('Email và mật khẩu không hợp lệ', 400);
    const { role } = user;
    const accessToken = generateAccessToken(user._id, role);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        signed: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        signed: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        msg: 'Đăng nhập thành công',
        user: {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
            refreshToken: user.refreshToken,
            cart: user.cart,
            wishlist: user.wishlist,
        },
        accessToken
    });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const cookie = req.signedCookies;
    if (!cookie || !cookie.refreshToken) throw new CustomError('Không tìm thấy refresh token trong cookie', 401);
    const result = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
    const response = await User.findOne({ _id: result.userId, refreshToken: cookie.refreshToken });
    res.status(200).json({
        accessToken: generateAccessToken(response._id, response.role)
    });
});

const logout = asyncHandler(async (req, res) => {
    const cookie = req.signedCookies;
    if (!cookie || !cookie.refreshToken) throw new CustomError('Không tìm thấy refresh token trong cookie', 401);
    await User.findOneAndUpdate(
        { refreshToken: cookie.refreshToken },
        { refreshToken: '' },
        { new: true }
    );

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true
    });

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    });
    res.status(200).json({
        msg: 'Đăng xuất thành công'
    })
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.query;
    if (!email) throw new CustomError('Vui lòng cung cấp email', 400);
    const user = await User.findOne({ email });
    if (!user) throw new CustomError('Người dùng không tồn tại', 404);
    const resetToken = await user.createPasswordChangeToken();
    await user.save();

    const html = `Nhấn vào <a href=${process.env.URL_SERVER}/resetPassword?token=${resetToken}&email=${email}>đây</a> để thay đổi mật khẩu.Email này có hiệu lực trong vòng 10 phút.`
    const data = {
        email,
        html
    };
    const result = await sendEmail(data);
    res.status(200).json({
        result
    });
});

const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body;
    if (!password) throw new CustomError('Vui lòng cung cấp mật khẩu mới', 400);
    if (!token) throw new CustomError('Cập nhật mật khẩu thất bại', 401);
    const user = await User.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: Date.now() } });
    if (!user) throw new CustomError('Cập nhật mật khẩu thất bại', 401);
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangeAt = new Date(Date.now());
    await user.save();
    res.status(200).json({
        msg: 'Cập nhật mật khẩu thành công'
    });
});

module.exports = {
    register,
    login,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword
};