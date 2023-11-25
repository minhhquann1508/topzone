require('dotenv').config();

const express = require('express');
const dbConnect = require('./config/dbConnect');

const app = express();
const port = process.env.PORT || 5000;

const { notFoundMiddleware, errorHandlerMiddleware } = require('./middleware/errorHandler');

const cookieParser = require('cookie-parser');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');
const productCategoryRouter = require('./routes/productCategoryRoute');
const brandRouter = require('./routes/brandRoute');
const productRouter = require('./routes/productRoute');
const reviewRouter = require('./routes/reviewRoute');
const couponRouter = require('./routes/couponRoute');
const orderRouter = require('./routes/orderRoute');
const blogCategoryRouter = require('./routes/blogCategoryRoute');
const blogRouter = require('./routes/blogRoute');

app.set('trust proxy', 1);
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60
}));
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/product-category', productCategoryRouter);
app.use('/api/v1/brand', brandRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/coupon', couponRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/blog-category', blogCategoryRouter);
app.use('/api/v1/blog', blogRouter);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

dbConnect();

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});