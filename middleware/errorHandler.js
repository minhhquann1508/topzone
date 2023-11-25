const CustomError = require("../errors/CustomError");

const notFoundMiddleware = (req, res, next) => res.status(404).json({ msg: 'Không tìm thấy đường dẫn' });

const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof CustomError) {
        res.status(err.statusCode).json({ msg: err.message });
    }
    else if (err.name === 'ValidationError') {
        res.status(400).json({ msg: Object.values(err.errors).map(item => item.message).join('.') })
    } else if (err.code && err.code === 11000) {
        res.status(400)
            .json({ msg: `${Object.keys(err.keyValue)} đã tồn tại, vui lòng nhập giá trị khác` })
    } else if (err.name === 'CastError') {
        res.status(404).json({ msg: `Không tìm thấy id: ${err.value}` })
    } else {
        res.status(500).json({ err });
    }
};

module.exports = {
    notFoundMiddleware,
    errorHandlerMiddleware
}