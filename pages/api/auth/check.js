import { verifyToken } from '../../../lib/auth';

const checkAuth = (req, res) => {
  try {
    const user = verifyToken(req);
    res.status(200).json({ username: user.username });
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export default checkAuth;
