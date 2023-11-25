const Brand = require('../models/Brand');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/CustomError');

const createBrand = asyncHandler(async (req, res) => {
    const brand = await Brand.create(req.body);
    res.status(201).json({ brand });
});

const getAllBrand = asyncHandler(async (req, res) => {
    const brands = await Brand.find({});
    res.status(200).json({ brands })
});

const getSingleBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    res.status(200).json({ brand });
});

const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    brand.title = req.body.title;
    await brand.save();
    res.status(200).json({ brand });
});

const uploadBrandLogo = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!req.file) throw new CustomError('Không tìm thấy bất kì tệp nào', 400);
    if (!req.file.mimetype.startsWith('image')) throw new CustomError('Vui lòng cung cấp file ảnh', 400);
    const maxSize = 1024 * 1024;
    if (!req.file.size > maxSize) throw new CustomError('Dung lượng ảnh phải thấp hơn 1MB', 400);
    const brand = await Brand.findByIdAndUpdate(id, { logo: req.file.path }, { new: true });
    if (!brand) throw new CustomError('Cập nhật hình ảnh thất bại', 400);
    res.status(200).json({
        msg: 'Cập nhật hình ảnh thành công',
        brand
    });
});

const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) throw new CustomError('Xóa thương hiệu không thành công', 400);
    res.status(200).json({ msg: 'Xóa thương hiệu thành công' });
});

module.exports = {
    createBrand,
    getAllBrand,
    getSingleBrand,
    updateBrand,
    uploadBrandLogo,
    deleteBrand
};

