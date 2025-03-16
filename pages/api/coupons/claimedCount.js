import Coupon from '../../../models/Coupon';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const claimedCount = await Coupon.countDocuments({ status: 'claimed' });
      res.status(200).json({ count: claimedCount });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
