const router = require('express').Router();
const { register, login, refreshAccessToken, logout, forgotPassword, resetPassword } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/refreshToken', refreshAccessToken);
router.put('/logout', logout);
router.get('/forgotPassword', forgotPassword);
router.put('/resetPassword', resetPassword);


module.exports = router;
