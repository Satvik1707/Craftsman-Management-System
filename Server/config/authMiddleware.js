const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.log('Token not found in header');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = await jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    console.log('Error during token verification');
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { authenticateToken };
