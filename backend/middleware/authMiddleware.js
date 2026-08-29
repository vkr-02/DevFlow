const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    };

    try{

        // console.log(req.headers.authorization);
        
        const [bearer, token] = authHeader.split(" ");

        if (bearer !== "Bearer" || !token) {
            return res.status(401).json({
                message: "Invalid token format"
            });
        };
        
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
        );
        
        // console.log(decoded)
        
        req.userId = decoded.userId;
        
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    };

};

module.exports = authMiddleware;