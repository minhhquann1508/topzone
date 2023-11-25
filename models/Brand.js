const mongoose = require('mongoose');
const slugify = require('slugify');

const BrandSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tên thương hiệu không bỏ trống'],
        unique: true
    },
    slug: String,
    logo: String
}, { timestamps: true });

BrandSchema.pre('save', async function () {
    this.slug = slugify(this.title, {
        lower: true,
        replacement: '-'
    });
});
module.exports = mongoose.model('Brand', BrandSchema);