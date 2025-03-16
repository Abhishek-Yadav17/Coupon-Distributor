import jwt from 'jsonwebtoken';

export const verifyToken = (req) => {
  const token = req.cookies.token;
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};
