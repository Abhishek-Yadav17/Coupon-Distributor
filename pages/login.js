import { useState } from 'react';
import { Box, TextField, Button, Typography, IconButton, Divider, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';
import GoogleIcon from '@mui/icons-material/Google'
import TwitterIcon from '@mui/icons-material/Twitter'
import GitHubIcon from '@mui/icons-material/GitHub'


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.status === 200) {
      router.push('/admin');
    } else {
      setError(data.message);
      setOpenSnackbar(true); 
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(to top, #F2D6A3, #B9B39D)', height: '100vh'}}>
      <Box sx={{width: '400px', height: '500px', bgcolor: '#FFF', borderRadius: '27px', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, gap: 1, color: 'white', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'}}>
        <Typography sx={{fontSize: '2vw', color: '#000', fontWeight: 'bold'}}>Admin Login</Typography>
        <Typography sx={{mb: 3, fontSize: '1vw', color: 'rgb(147, 145, 158)'}}>Get Started</Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
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
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              height: '65px',
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
          <Button type="submit" variant="contained" sx={{mt: 3, bgcolor: '#1C252E', color: 'white', textTransform: 'capitalize', width: '100%', borderRadius: '10px', height: '45px', fontWeight: 'bold'}}>Login</Button>
        </form>

        <Divider sx={{ mt: 3, width: '100%', bgcolor: '#6A677A' }} />

        <Box sx={{ my: 3, display: 'flex', justifyContent: 'center', width: '100%', gap: 5 }}>
          <IconButton href="https://google.com" target="_blank" sx={{ color: '#DB4437' }}>
            <GoogleIcon />
          </IconButton>
          <IconButton href="https://twitter.com" target="_blank" sx={{ color: '#1DA1F2' }}>
            <TwitterIcon />
          </IconButton>
          <IconButton href="https://github.com" target="_blank" sx={{ color: '#333' }}>
            <GitHubIcon sx={{bgcolor: 'white', borderRadius: '50%'}} />
          </IconButton>
        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 10 }}
      />
    </Box>
  );
};

export default Login;
