const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const BlogCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tên bài viết không được bỏ trống']
    },
    slug: String,
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Người tạo danh mục không được bỏ trống']
    },
}, { timestamps: true });

BlogCategorySchema.pre('save', async function () {
    this.slug = slugify(this.title, {
        lower: true,
        replacement: '-'
    });
});

module.exports = mongoose.model('BlogCategory', BlogCategorySchema);