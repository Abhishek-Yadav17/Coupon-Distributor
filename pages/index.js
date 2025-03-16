import { useState, useEffect } from 'react';
import { Button, Typography, Box, IconButton,  } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useRouter } from 'next/router';

const Home = () => {
  const [message, setMessage] = useState('');
  const [activeCoupons, setActiveCoupons] = useState([]);
  const [claimedCount, setClaimedCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchCouponsData = async () => {
      const activeRes = await fetch('/api/coupons');
      const activeData = await activeRes.json();
      setActiveCoupons(activeData.filter(coupon => coupon.isActive));

      const claimedRes = await fetch('/api/coupons/claimedCount');
      const claimedData = await claimedRes.json();
      setClaimedCount(claimedData.count);
    };

    fetchCouponsData();
  }, []);

  const claimCoupon = async () => {
    const res = await fetch('/api/coupons/claim', {
      method: 'POST',
      credentials: 'include',
    });
    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      const activeRes = await fetch('/api/coupons');
      const activeData = await activeRes.json();
      setActiveCoupons(activeData.filter(coupon => coupon.isActive));

      const claimedRes = await fetch('/api/coupons/claimedCount');
      const claimedData = await claimedRes.json();
      setClaimedCount(claimedData.count);
    }
  };

  const getDaysLeft = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const timeDiff = expiry - today;
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };

  const handleAdminClick = () => {
    router.push('/admin');
  };


  return (
    <Box sx={{ bgcolor: '#FFF4D3', minHeight: '100vh', px: 4 }}>
      <Box sx={{ width: '100%', height: '10vh', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Typography sx={{ fontSize: '1.5vw', fontWeight: 'bold' }}>Claim Your Coupons</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography fontWeight='bold'>Admin</Typography>
          <IconButton onClick={handleAdminClick}>
            <AccountCircleIcon sx={{ fontSize: 35, color: 'black' }} />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{display: 'flex',bgcolor: 'white', alignItems: 'center', justifyContent: 'space-between', mt: 3, py: 1, px: 3, borderRadius: '10px'}}>
        <Button onClick={claimCoupon} sx={{ bgcolor: '#1C252E', borderRadius: '9px', py: 1, px: 2, textTransform: 'capitalize', fontWeight: 'bold', mb: 3, color: '#fff', mt: 2.5 }}>
          Claim a Coupon
        </Button>
        {message && <Typography>{message}</Typography>}
        <Typography>Number of Coupons Claimed: {claimedCount}</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 3, justifyContent: 'space-evenly' }}>
        {activeCoupons.map((coupon) => (
          <Box key={coupon._id} sx={{ height: '200px', width: '400px', boxShadow: 3, borderRadius: '13px', display: 'flex', overflow: 'hidden', mt: 3, position: 'relative' }}>
            {coupon.status === 'claimed' && (
              <Box 
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(6, 143, 6, 0.4)',
                  borderRadius: '13px', 
                }}
              />
            )}
            <Box sx={{ height: '100%', width: '20%', bgcolor: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '2px dashed rgba(0, 0, 0, 0.13)' }}>
              <Typography sx={{ transform: 'rotate(270deg)', whiteSpace: 'nowrap' }}>Enjoy your Gift</Typography>
            </Box>
            <Box sx={{ height: '100%', width: '60%', bgcolor: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '1.6vw', textTransform: 'uppercase' }}>Coupon Code</Typography>
              <Typography sx={{ bgcolor: 'black', color: 'white', py: 2, px: 4, mt: 1 }}>{coupon.code}</Typography>
              <Typography sx={{ mt: 4 }}>Expires in {getDaysLeft(coupon.expiryDate)} days</Typography>
            </Box>
            <Box sx={{ height: '100%', width: '20%', bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {coupon.status === 'claimed' && <Typography sx={{ fontSize: 25, color: 'green' }}>✔</Typography>}
              <img src='/barcode.png' alt='barcode' width={200} height={100} style={{ transform: 'rotate(270deg)' }} />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Home;
