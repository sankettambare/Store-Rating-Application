const jwt = require('jsonwebtoken');
const { User } = require('../Model');
require('dotenv').config();

async function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Unauthorized' });

  const token = header.split(' ')[1]; // fixed here

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function permit(...allowed) {
  return (req, res, next) => {
    const { role } = req.user;
    if (allowed.includes(role)) return next();
    return res.status(403).json({ message: 'Forbidden' });
  };
}

module.exports = { auth, permit };
