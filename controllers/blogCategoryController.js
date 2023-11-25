const BlogCategory = require('../models/BlogCategory');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/CustomError');

const createBlogCategory = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const category = await BlogCategory.create({ ...req.body, createdBy: userId });
    res.status(201).json({ category })
});

const getAllBlogCategories = asyncHandler(async (req, res) => {
    const categories = await BlogCategory.find({});
    res.status(200).json({ categories });
});

const getSingleBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await BlogCategory.findById(id);
    res.status(200).json({ category });
});

const updateBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    if (!title) throw new CustomError('Vui lòng nhập tên danh mục', 400);
    const category = await BlogCategory.findById(id);
    category.title = title;
    await category.save();
    res.status(200).json({ msg: 'Cập nhật danh mục thành công' });
});

const deleteBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await BlogCategory.findByIdAndDelete(id);
    if (!category) throw new CustomError('Xóa danh mục không thành công', 400);
    res.status(200).json({ msg: 'Xóa danh mục thành công' });
});

module.exports = {
    createBlogCategory,
    getAllBlogCategories,
    getSingleBlogCategory,
    updateBlogCategory,
    deleteBlogCategory
};
