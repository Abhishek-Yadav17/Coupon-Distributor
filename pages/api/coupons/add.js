import connectDb from '../../../lib/mongoose';
import Coupon from '../../../models/Coupon';

connectDb();

const addCoupon = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { code, status, isActive, expiryDate } = req.body;

  if (!code || !status || !expiryDate) {
    return res.status(400).json({ message: 'Code and Status are required' });
  }

  try {
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const newCoupon = new Coupon({
      code,
      status,
      isActive,
      expiryDate,
      claimedBy: [],
    });

    await newCoupon.save();
    res.status(200).json({ message: 'Coupon added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add coupon' });
  }
};

export default addCoupon;
