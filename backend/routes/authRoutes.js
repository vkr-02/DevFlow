const express = require('express');
const router = express.Router();

const { register,login, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);

router.get('/test', authMiddleware, (req, res, next) =>{
    res.json({
        message: "You reached the protected route"
    });
});

router.get('/profile',authMiddleware, getProfile)

module.exports = router;