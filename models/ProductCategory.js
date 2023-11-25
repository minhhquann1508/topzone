const mongoose = require('mongoose');
const slugify = require('slugify');

const ProductCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tên danh mục không bỏ trống'],
        unique: true
    },
    slug: String
}, { timestamps: true });

ProductCategorySchema.pre('save', async function () {
    this.slug = slugify(this.title, {
        lower: true,
        replacement: '-'
    });
});

module.exports = mongoose.model('ProductCategory', ProductCategorySchema);