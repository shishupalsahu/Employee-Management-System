import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// 1. Check if user is logged in (Verify Token)
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Token format: "Bearer <token_string>"
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user from database (excluding password) and attach to request
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Agle function par jao
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// 2. Check if user is Admin/Manager
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied, Admin only' });
    }
};