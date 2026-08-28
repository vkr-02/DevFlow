const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    console.log(req.headers.authorization);

    const [bearer, token] = req.headers.authorization.split(" ");

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET,
    );

    console.log(decoded)
};

module.exports = authMiddleware;