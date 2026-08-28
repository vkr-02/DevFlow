const express = require('express');
const router = express.Router();

const { register } = require('../controllers/authController');
const { login } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);

router.get('/test', authMiddleware, (req, res, next) =>{
    res.json({
        message: "You reached the protected route"
    });
});

module.exports = router;