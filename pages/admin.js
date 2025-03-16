import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Table, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, TextField, Card, CardContent, Typography, IconButton, TablePagination, colors } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { LocalOffer, DoNotDisturb, Mood, NewReleases, Assessment } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminPanel = () => {
  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [status, setStatus] = useState('available');
  const [isActive, setIsActive] = useState(true);
  const [message, setMessage] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [open, setOpen] = useState(false);
  const [updatingCoupon, setUpdatingCoupon] = useState(null);
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/auth/check', { method: 'GET' });
      if (res.status === 401) {
        router.push('/login');
      } else {
        const data = await res.json();
        if (data.username) {
          fetchCoupons();
        }
      }
    };
    checkAuth();
  }, []);

  const fetchCoupons = async () => {
    const res = await fetch('/api/coupons');
    const data = await res.json();
    setCoupons(data);
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setUpdatingCoupon(null);
  };

  const handleAddCoupon = async () => {
    if (!couponCode || !expiryDate) {
      setMessage('Coupon code is required.');
      return;
    }

    const response = await fetch('/api/coupons/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: couponCode, status, isActive, expiryDate }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Coupon added successfully!');
      setCouponCode('');
      setStatus('available');
      setIsActive(true);
      setExpiryDate('');
      handleClose();
      fetchCoupons();
    } else {
      setMessage(data.message || 'Failed to add coupon');
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    const response = await fetch(`/api/coupons/${couponId}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Coupon deleted successfully!');
      fetchCoupons();
    } else {
      setMessage(data.message || 'Failed to delete coupon');
    }
  };

  const handleOpenUpdate = (coupon) => {
    setCouponCode(coupon.code);
    setStatus(coupon.status);
    setIsActive(coupon.isActive);
    setUpdatingCoupon(coupon);
    setOpen(true);
  };

  const handleUpdateCoupon = async () => {
    if (!couponCode) {
      setMessage('Coupon code is required.');
      return;
    }

    const response = await fetch(`/api/coupons/${updatingCoupon._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: couponCode, status, isActive }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Coupon updated successfully!');
      setCouponCode('');
      setStatus('available');
      setIsActive(true);
      handleClose();
      fetchCoupons();
    } else {
      setMessage(data.message || 'Failed to update coupon');
    }
  };

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
    });

    if (res.ok) {
      router.push('/');
    } else {
      alert('Failed to log out');
    }
  };

  const cardStyle = {
    padding: '0.7vw',
    borderRadius: '16px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    height: '10vw',
    width: '16vw'
  };

  const stats = {
    total: coupons.length,
    active: coupons.filter(coupon => coupon.isActive).length,
    disabled: coupons.filter(coupon => !coupon.isActive).length,
    claimed: coupons.filter(coupon => coupon.status === 'claimed').length,
    recentlyAdded: coupons.slice(0, 5),
  };

  const chartData = {
    labels: ['Active Coupons', 'Disabled Coupons', 'Claimed Coupons', 'Total Coupons'],
    datasets: [
      {
        data: [stats.active, stats.disabled, stats.claimed, stats.total],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          padding: 20,
        },
        align: 'center'
      },
    },
  };

  const getDaysLeft = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const timeDiff = expiry - today;
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Box sx={{ width: '100%', height: '10vh', bgcolor: '', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3 }}>
        <Typography sx={{ fontSize: '1.5vw', fontWeight: 'bold' }}>Dashboard</Typography>
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Typography fontWeight='bold'>Admin</Typography>
          <IconButton>
            <AccountCircleIcon sx={{ fontSize: 35, color: 'black', mr: 3 }} />
          </IconButton>
          <IconButton onClick={handleLogout}>
            <ExitToAppIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', bgcolor: '#F9FAFB' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: '#fff', p: 3, gap: 3 }}>
          <Card sx={{ background: 'linear-gradient(to right,rgb(219, 254, 229),rgb(160, 244, 188))', color: 'rgb(4, 116, 41)', height: '28vh', borderRadius: '16px' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
              <Assessment sx={{ alignSelf: 'flex-end', fontSize: '3vw' }} />
              <Typography sx={{ fontSize: '1.1vw', mt: 4 }}>Total Coupons</Typography>
              <Typography sx={{ fontSize: '2vw', fontWeight: 'bold' }}>{stats.total}</Typography>
            </CardContent>
          </Card>
          <Box
            sx={{
              width: 300,
            }}
            variant="permanent"
            anchor="left"
          >
            <Paper sx={{ padding: 2, borderRadius: '16px', boxShadow: 3, height: '63vh' }}>
              <Typography variant="subtitle1" sx={{ textAlign: 'center', marginBottom: 2 }}>
                Statistics
              </Typography>
              <Box sx={{ height: '320px', width: '100%' }}>
                <Doughnut data={chartData} options={chartOptions} />
              </Box>
            </Paper>

          </Box>
        </Box>
        <Box sx={{ width: 'calc(100% - 300px)', p: 3 }}>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ color: '#1C252E', fontSize: '1.6vw', fontWeight: 'bold' }}>Coupons</Typography>
            <Button variant="contained" onClick={handleOpen} sx={{ bgcolor: '#1C252E', borderRadius: '9px', py: 1, px: 2, textTransform: 'capitalize', fontWeight: 'bold', mb: 3 }}>
              <AddIcon sx={{ mr: 1 }} />Add Coupon
            </Button>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Card sx={{ ...cardStyle, background: 'linear-gradient(to right, #DBEFFE, #C9E5FD)', color: '#042174' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <LocalOffer sx={{ alignSelf: 'flex-end', fontSize: '2vw' }} />
                <Typography sx={{ fontSize: '1.1vw', mt: 3 }}>Active Coupons</Typography>
                <Typography sx={{ fontSize: '2vw', fontWeight: 'bold' }}>{stats.active}</Typography>
              </CardContent>
            </Card>

            <Card sx={{ ...cardStyle, background: 'linear-gradient(to right, #FFEBDF, #FFE0CF) ', color: '#7A0916' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <DoNotDisturb sx={{ alignSelf: 'flex-end', fontSize: '2vw' }} />
                <Typography sx={{ fontSize: '1.1vw', mt: 3 }}>Disabled Coupons</Typography>
                <Typography sx={{ fontSize: '2vw', fontWeight: 'bold' }}>{stats.disabled}</Typography>
              </CardContent>
            </Card>

            <Card sx={{ ...cardStyle, background: 'linear-gradient(to right, #FFF6D9, #FFF0C4)', color: '#7A4100' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <Mood sx={{ alignSelf: 'flex-end', fontSize: '2vw' }} />
                <Typography sx={{ fontSize: '1.1vw', mt: 3 }}>Claimed Coupons</Typography>
                <Typography sx={{ fontSize: '2vw', fontWeight: 'bold' }}>{stats.claimed}</Typography>
              </CardContent>
            </Card>

            <Card sx={{ ...cardStyle, background: 'linear-gradient(to right, #F1DFFF, #EAD0FF)', color: ' #27097A' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <NewReleases sx={{ alignSelf: 'flex-end', fontSize: '2vw' }} />
                <Typography sx={{ fontSize: '1.1vw', mt: 3 }}>Recently Added</Typography>
                <Typography sx={{ fontSize: '2vw', fontWeight: 'bold' }}>{stats.recentlyAdded.length}</Typography>
              </CardContent>
            </Card>
          </Box>

          <TableContainer sx={{ display: 'flex', flexDirection: 'column ', alignItems: 'center', mt: 2, boxShadow: 3, bgcolor: '#fff', borderRadius: '16px', p: 2, py: 3, height: '61vh' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ border: 'none', fontWeight: 'bold', fontSize: '1.1vw', pr: 5 }}>Coupon Code</TableCell>
                  <TableCell sx={{ border: 'none', fontWeight: 'bold', fontSize: '1.1vw', pr: 5 }}>Expired In</TableCell>
                  <TableCell sx={{ border: 'none', fontWeight: 'bold', fontSize: '1.1vw', pr: 5 }}>Status</TableCell>
                  <TableCell sx={{ border: 'none', fontWeight: 'bold', fontSize: '1.1vw', pr: 5 }}>Status</TableCell>
                  <TableCell sx={{ border: 'none', fontWeight: 'bold', fontSize: '1.1vw' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coupons.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((coupon) => (
                  <TableRow key={coupon._id}>
                    <TableCell sx={{ border: 'none' }}>{coupon.code}</TableCell>
                    <TableCell sx={{ border: 'none' }}>
                      {getDaysLeft(coupon.expiryDate) > 0
                        ? `${getDaysLeft(coupon.expiryDate)} days left`
                        : 'Expired'}
                    </TableCell>
                    <TableCell sx={{ border: 'none', textTransform: 'capitalize' }}>{coupon.status}</TableCell>
                    <TableCell sx={{ border: 'none', color: coupon.isActive ? '#259765' : '#C03732', fontWeight: 'bold', fontSize: '0.88em' }}>
                      {coupon.isActive ? 'Active' : 'Disabled'}
                    </TableCell>
                    <TableCell sx={{ border: 'none' }}>
                      <Button
                        onClick={() => handleDeleteCoupon(coupon._id)}
                        sx={{ mr: 1, fontSize: '0.88em', textTransform: 'capitalize', bgcolor: '#F7DDD8', color: '#B71D18', fontWeight: 'bold', borderRadius: '8px' }}
                      >
                        Delete
                      </Button>
                      <Button
                        onClick={() => handleOpenUpdate(coupon)}
                        sx={{ mr: 1, fontSize: '0.88em', textTransform: 'capitalize', bgcolor: '#EDF4FE', color: '#1877F2', fontWeight: 'bold', borderRadius: '8px' }}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[4]}
              component="div"
              count={coupons.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{bgcolor: '#1C252E', borderRadius: '20px', color: '#fff', height: '3.4vw', '& .MuiIconButton-root': {color: '#fff'}, '& .MuiTablePagination-actions .MuiIconButton-root:hover': {bgcolor: '#333'}}}
            />
          </TableContainer>

          <p>{message}</p>
        </Box>
      </Box>


      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <h2>{updatingCoupon ? 'Update Coupon' : 'Add Coupon'}</h2>

          <TextField
            label="Coupon Code"
            variant="outlined"
            fullWidth
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            sx={{
              mb: 4,
              mt: 3,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#6A677A',
                  borderRadius: '10px',
                },
                '&:hover fieldset': {
                  borderColor: '#8478A7',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#8478A7',
                },
                '& input': {
                  color: '#000',
                  bgcolor: '#FFF',
                  borderRadius: '10px',
                  height: '1.3vw'
                },
              },
              '& .MuiInputLabel-root': {
                color: '#6A677A',
                fontSize: '1vw'
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#8478A7',
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#6A677A',
              },
            }}
          />

          <TextField
            label="Status"
            variant="outlined"
            fullWidth
            select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            SelectProps={{
              native: true,
            }}
            sx={{
              mb: 4,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#6A677A',
                  borderRadius: '10px',
                },
                '&:hover fieldset': {
                  borderColor: '#8478A7',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#8478A7',
                },
                '& input': {
                  color: '#000',
                  bgcolor: '#FFF',
                  borderRadius: '10px',
                  height: '1.3vw'
                },
              },
              '& .MuiInputLabel-root': {
                color: '#6A677A',
                fontSize: '1vw'
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#8478A7',
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#6A677A',
              },
            }}
          >
            <option value="available">Available</option>
            <option value="claimed">Claimed</option>
          </TextField>

          <TextField
            label="Expiry Date"
            variant="outlined"
            fullWidth
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#6A677A',
                  borderRadius: '10px',
                },
                '&:hover fieldset': {
                  borderColor: '#8478A7',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#8478A7',
                },
                '& input': {
                  color: '#000',
                  bgcolor: '#FFF',
                  borderRadius: '10px',
                  height: '1.3vw'
                },
              },
              '& .MuiInputLabel-root': {
                color: '#6A677A',
                fontSize: '1vw'
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#8478A7',
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#6A677A',
              },
            }}
          />

          <div style={{marginBottom: 5}}>
            <label>Active</label>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          </div>

          <Button
            variant="contained"
            color="primary"
            onClick={updatingCoupon ? handleUpdateCoupon : handleAddCoupon}
            sx={{ bgcolor: '#1C252E', borderRadius: '9px', py: 1, px: 2, textTransform: 'capitalize', fontWeight: 'bold', mb: 3 }}
          >
            {updatingCoupon ? 'Update Coupon' : 'Add Coupon'}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  py: 3,
  px: 4,
  width: 350,
  height: 400,
  borderRadius: '16px'
};

export default AdminPanel;
