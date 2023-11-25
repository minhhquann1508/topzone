const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'Họ người dùng không được bỏ trống']
    },
    lastname: {
        type: String,
        required: [true, 'Tên người dùng không được bỏ trống']
    },
    password: {
        type: String,
        required: [true, 'Mật khẩu không được bỏ trống']
    },
    email: {
        type: String,
        unique: [true, 'Email không được trùng lặp'],
        required: [true, 'Email không được bỏ trống']
    },
    phone: {
        type: String,
        unique: [true, 'Số điện thoại không được trùng lặp'],
        required: [true, 'Số điện thoại không được bỏ trống']
    },
    cart: [
        {
            product: { type: mongoose.Types.ObjectId, ref: 'Product' },
            quantity: Number,
            price: Number,
            thumbnail: String,
            title: String
        }
    ],
    address: String,
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'user']
    },
    wishlist: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
    isBlocked: {
        type: Boolean,
        default: false
    },
    avatar: String,
    refreshToken: String,
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
}, { timestamps: true });

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = bcrypt.genSaltSync(12);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.isCorrectPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.createPasswordChangeToken = async function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    return resetToken;
};

module.exports = mongoose.model('User', UserSchema);