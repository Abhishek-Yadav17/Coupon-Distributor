export default (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  res.setHeader('Set-Cookie', 'token=; Max-Age=0; path=/; SameSite=Strict');

  res.status(200).json({ message: 'Logged out successfully' });
};
