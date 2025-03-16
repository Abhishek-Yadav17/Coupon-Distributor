import connectDb from '../../../lib/mongoose';
import Coupon from '../../../models/Coupon';

connectDb();

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  if (method === 'DELETE') {
    try {
      const coupon = await Coupon.findByIdAndDelete(id);
      if (!coupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
      return res.status(200).json({ message: 'Coupon deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  } else if (method === 'PUT') {
    try {
      const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedCoupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
      return res.status(200).json(updatedCoupon);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
