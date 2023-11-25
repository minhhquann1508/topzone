const Blog = require('../models/Blog');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/CustomError');

const createBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.create({ ...req.body, createdBy: req.user.userId });
    res.status(201).send({ blog });
});

const getAllBlog = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({});
    res.status(200).json({ blogs });
});

const getSingleBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    blog.totalViews = blog.totalViews + 1;
    await blog.save();
    res.status(200).json({ blog });
});

const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, content, category } = req.body;
    if (!title || !content || !category) throw new CustomError('Vui lòng nhập đủ các thông tin', 400);
    const blog = await Blog.findById(id);
    blog.title = title;
    blog.content = content;
    blog.category = category;
    await blog.save();
    res.status(200).json({ blog });
});

const uploadBlogThumbnail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!req.file) throw new CustomError('Không tìm thấy bất kì tệp nào', 400);
    if (!req.file.mimetype.startsWith('image')) throw new CustomError('Vui lòng cung cấp file ảnh', 400);
    const maxSize = 1024 * 1024;
    if (!req.file.size > maxSize) throw new CustomError('Dung lượng ảnh phải thấp hơn 1MB', 400);
    const blog = await Blog.findByIdAndUpdate(id, { thumbnail: req.file.path }, { new: true });
    if (!blog) throw new CustomError('Cập nhật hình ảnh thất bại', 400);
    res.status(200).json({
        msg: 'Cập nhật hình ảnh thành công',
        blog
    });
});

const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findOneAndDelete(id);
    if (!blog) throw new CustomError('Xoá bài viết không thành công', 400);
    res.status(200).json({ msg: 'Xóa bài viết thành công' });
});

module.exports = {
    createBlog,
    getAllBlog,
    getSingleBlog,
    updateBlog,
    uploadBlogThumbnail,
    deleteBlog
};
