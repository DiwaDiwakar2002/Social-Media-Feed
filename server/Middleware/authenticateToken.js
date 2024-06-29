const jwt = require('jsonwebtoken');
const jwtSecret = 'c49w84d9c84w9dc8wdc7';

const authenticateToken = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
