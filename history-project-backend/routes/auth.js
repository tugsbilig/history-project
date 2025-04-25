const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Clean and sanitize inputs
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanConfirmPassword = confirmPassword.trim();

    // Validation checks
    if (!username || !cleanEmail || !cleanPassword || !cleanConfirmPassword) {
      return res.status(400).json({ message: 'Бүх талбарыг бөглөнө үү' });
    }

    if (cleanPassword !== cleanConfirmPassword) {
      return res.status(400).json({ message: 'Нууц үг таарахгүй байна' });
    }

    if (cleanPassword.length < 6) {
      return res.status(400).json({ message: 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой' });
    }

    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email: cleanEmail }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Имэйл эсвэл хэрэглэгчийн нэр аль хэдийн бүртгэгдсэн байна' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(cleanPassword, 12);

    // Create new user
    const user = new User({
      username,
      email: cleanEmail,
      password
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return the response
    res.status(201).json({
      token,
      userId: user._id,
      username: user.username,
      email: user.email,
      message: 'Амжилттай бүртгүүллээ'
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Серверийн алдаа' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Clean and sanitize email input
    const cleanEmail = email.trim().toLowerCase();
    console.log('Login attempt for:', cleanEmail); // Debug

    // Find user by email
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      console.log('No user found for email:', cleanEmail); // Debug
      return res.status(400).json({ message: 'Нэвтрэх мэдээлэл буруу байна' });
    }

    console.log('Comparing password...'); // Debug
    const isMatch = await bcrypt.compare(password.trim(), user.password);
    console.log('Password match:', isMatch); // Debug

    if (!isMatch) {
      return res.status(400).json({ message: 'Нэвтрэх мэдээлэл буруу байна' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return the response with the token and user info
    res.json({
      token,
      userId: user._id,
      username: user.username,
      email: user.email
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Серверийн алдаа' });
  }
});

//logout
router.post('/logout', (req, res) => {
  try {
    // Clear the HTTP-only cookie
    res.clearCookie('token', { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
    
    return res.status(200).json({ message: 'Successfully logged out' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Logout failed' });
  }
});


module.exports = router;
