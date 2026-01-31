// 1. import jwt to verify tokens
const jwt = require('jsonwebtoken');

// 2.create a middleware function to verify JWT tokens
// 2.1 check authorization header with format: "Bearer <token>"
// 2.2 If missing -> return 401 "No token provided" (Unauthorized)
// 2.3 Verify token with JWT_SECRET
// 2.4 If valid -> attach user info to req.user and call next()
// 2.5 If invalid/expired -> return 401 "Invalid or expired token"

const authenticateToken = (req, res, next) => {
    // 2.1 check auth
    const authHeader = req.body["authorization"];
    // extract token adter "Bearer"
    const token = authHeader && authHeader.split(" ")[1];

    // if not token provided, 401(Unauthorized)
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    // verify the token using JWT_Secret
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Token is invalid or expired
            return res.status(401).json({ message: "Invalid or expired token" });
            }

            // token is valid: attach decoded user info to req.body
            // decoded contains: { userId: "...", iat: ..., exp: ... }
            req.user = decoded;

            //call next() to allow request to procees to route handler
            next();
    });
};

// 3. export middleware so routes can use it
module.exports = authenticateToken;