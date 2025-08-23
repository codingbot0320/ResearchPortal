// sb.js
const express = require('express');
const bcrypt = require('bcryptjs');  
const jwt = require('jsonwebtoken');
const { query } = require('./db'); // Import db.js

const app = express();
app.use(express.json());

// Secret key for JWT (keep it in .env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// ------------------ SIGNUP ------------------
app.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body; // include role

  try {
    // Check if user already exists
    const existingUser = await query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists!' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    await query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
});


// ------------------ LOGIN ------------------
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (user.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user[0].password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user[0].id, email: user[0].email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful!', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in user' });
  }
});

// ------------------ SERVER ------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
