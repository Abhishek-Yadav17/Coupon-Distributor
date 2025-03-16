import connectDb from '../../../lib/mongoose';
import Coupon from '../../../models/Coupon';

connectDb();

const getCoupons = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching coupons' });
  }
};

export default getCoupons;
