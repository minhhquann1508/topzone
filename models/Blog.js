const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tên bài viết không được bỏ trống']
    },
    totalViews: {
        type: Number,
        default: 0
    },
    content: {
        type: String,
        required: [true, 'Nội dung bài viết không bỏ trống']
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Người tạo sản phẩm không được bỏ trống']
    },
    thumbnail: String,
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'BlogCategory',
        required: [true, 'Danh mục bài viết không bỏ trống']
    }
}, { timestamps: true });

module.exports = mongoose.model('Blog', BlogSchema);