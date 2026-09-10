const jwt = require("jsonwebtoken");

const blacklist = require("../service/tokenBlacklist");

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Token não informado"
        });
    }

    const token = authHeader.replace("Bearer ", "");

     if (blacklist.has(token)) {
        return res.status(401).json({
            message: "Token revogado"
        });
    }


    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        return next();

    } catch (err) {

        return res.status(401).json({
            message: err.message
        });
    }
}

module.exports = authMiddleware