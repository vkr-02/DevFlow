const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Name, email and password are required"
        });
    };

    if (password.length < 6) {
    return res.status(400).json({
        message: "Password must be at least 6 characters"
    });
    };

    if(!email.includes("@")){
        return res.status(400).json({
            message: "Enter a valid email"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        email,
        password: hashedPassword
    });


    await user.save();

    // console.log(req.body);

    res.status(201).json({
        message:"User registered successfully"
    });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }
        res.status(500).json({
            message: "Server error"
        })
    };
    
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        };

        const user = await User.findOne({ email });
        
        if(!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        };
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        if(!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        };

        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );
        return res.status(200).json({
            message: "Login successful",
            token
        });
   } catch (error){
    console.log(error);

    return res.status(500).json({
        message: "Server error"
    });
   };
};

const getProfile = async (req, res) => {
    const user = await User.findById(req.userId)

    if(!user) {
        return res.status(404).json({
            message: "User not found!"
        });
    };
    return res.status(200).json({
        name: user.name,
        email: user.email
    });
};

module.exports = {
    register,
    login,
    getProfile
};