import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function authMiddleware(req, res, next) {
    // console.log("Auth middleware called");
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user info to request object
        // console.log("Decoded user:", req.user);
        // console.log("req user:", decoded);
        next(); // Proceed to the next middleware or route handler
    }
    catch (err) {
        console.error("Error in auth middleware:", err);
        return res.status(403).json({ error: "Invalid or expired token" });
    }
}

export function adminMiddleware(req, res, next) {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Access denied, admin only" });

    next();
}