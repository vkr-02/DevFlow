const bcrypt = require("bcrypt");
const User = require("../models/User");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        email,
        password: hashedPassword
    });

    await user.save();

    console.log(req.body);

    res.status(201).json({
        message:"User registered successfully"
    });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }
    };

    console.log(error);
    
    res.status(500).json({
            message: "Server error"
        })
};

module.exports = {
    register,
};