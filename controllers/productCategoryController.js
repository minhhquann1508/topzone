const ProductCategory = require('../models/ProductCategory');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/CustomError');

const createCategory = asyncHandler(async (req, res) => {
    const category = await ProductCategory.create(req.body);
    res.status(201).json({ category });
});

const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await ProductCategory.find({});
    if (!categories) throw new CustomError('Không tìm thấy danh mục', 400);
    res.status(200).json({ categories });
});

const getSingleCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await ProductCategory.findById(id);
    res.status(200).json({ category });
});

const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const category = await ProductCategory.findById(id);
    category.title = title;
    await category.save();
    res.status(200).json({ category });
});

const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await ProductCategory.findByIdAndDelete(id);
    if (!category) throw new CustomError('Không thể xóa danh mục', 400);
    res.status(200).json({ msg: 'Xóa danh mục thành công' });
});

module.exports = {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory
};