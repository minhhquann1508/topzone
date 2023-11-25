const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/CustomError');

const createProduct = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const product = await Product.create({ ...req.body, createdBy: userId });
    res.status(201).json({ product });
});

const getAllProduct = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    let excludeFields = ['sort', 'limit', 'page', 'fields'];
    excludeFields.forEach(el => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, matchedEl => `$${matchedEl}`);
    let formatQueries = JSON.parse(queryString);

    if (queries?.title) formatQueries.title = { $regex: queries.title, $options: 'i' };
    let queryCommand = Product.find(formatQueries);

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }

    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const skip = (page - 1) * limit;

    const products = await queryCommand.skip(skip).limit(limit);
    const total = await Product.find(formatQueries).countDocuments();
    res.status(200).json({
        products,
        total,
        currentPage: page,
        userPerPage: Number(limit)
    });

});

const getSingleProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { $inc: { totalViews: 1 } }, { new: true }).populate('brand category reviews');;
    res.status(200).json({ product });
});

const updateThumbnail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!req.file) throw new CustomError('Không tìm thấy bất kì tệp nào', 400);
    if (!req.file.mimetype.startsWith('image')) throw new CustomError('Vui lòng cung cấp file ảnh', 400);
    const maxSize = 1024 * 1024;
    if (!req.file.size > maxSize) throw new CustomError('Dung lượng ảnh phải thấp hơn 1MB', 400);
    const product = await Product.findByIdAndUpdate(id, { thumbnail: req.file.path }, { new: true });
    if (!product) throw new CustomError('Cập nhật hình ảnh thất bại', 400);
    res.status(200).json({
        msg: 'Cập nhật hình ảnh thành công',
        product
    });
});

const updateImages = asyncHandler(async (req, res) => {
    if (!req.files) throw new CustomError('Không tìm thấy file', 400);
    const { id } = req.params;
    const product = await Product
        .findByIdAndUpdate(id, { $push: { images: { $each: req.files.map(el => el.path) } } }, { new: true });
    res.status(200).json({
        msg: 'Cập nhật hình ảnh thành công',
        product
    });
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, desc, price, brand, category } = req.body;
    if (!title || !desc || !price || !category || !brand) throw new CustomError('Vui lòng cung cấp đủ các thông tin', 400);
    const product = await Product.findById(id);
    product.title = title;
    product.desc = desc;
    product.price = price;
    product.category = category;
    product.brand = brand;
    await product.save();
    res.status(200).json({ msg: 'Cập nhật sản phẩm thành công', product });
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new CustomError('Xóa sản phẩm thất bại', 400)
    res.status(200).json({ msg: 'Xóa sản phẩm thành công' });
});

module.exports = {
    createProduct,
    getAllProduct,
    getSingleProduct,
    updateThumbnail,
    updateImages,
    updateProduct,
    deleteProduct
};