const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const verifyToken = asyncHandler(async (req, res, next) => {
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req?.headers?.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) res.status(401).json({
                msg: 'Accesstoken không hợp lệ'
            });
            req.user = decoded;
            next();
        });
    } else {
        res.status(401).json({
            msg: 'Yêu cầu xác thực'
        });
    }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    const { role } = req.user;
    if (role !== 'admin')
        res.status(401).json({
            msg: "Bạn không có quyền truy cập"
        });
    next();
});

module.exports = {
    verifyToken,
    isAdmin
}

