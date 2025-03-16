import connectDb from '../../../lib/mongoose';
import Coupon from '../../../models/Coupon';
import cookie from 'cookie';

connectDb();

const claimCoupon = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { ip, sessionId } = req.cookies;

  const cooldownPeriod = 60 * 60 * 1000;
  const lastClaimTime = Date.now();

  const coupon = await Coupon.findOne({ status: 'available', isActive: true }).sort({ createdAt: 1 });

  if (!coupon) {
    return res.status(404).json({ message: 'No available coupons' });
  }

  if (coupon.claimedBy.includes(ip) || coupon.claimedBy.includes(sessionId)) {
    return res.status(403).json({ message: 'You have already claimed a coupon within the cooldown period.' });
  }

  coupon.status = 'claimed';
  coupon.claimedBy.push(ip, sessionId);
  await coupon.save();

  res.status(200).json({ message: 'Coupon claimed successfully', coupon });
};

export default claimCoupon;
