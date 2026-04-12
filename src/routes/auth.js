import express from 'express';
import { User } from '../models/index.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// Login route - handles user authentication
router.post('/login', async (req, res) => {

  // Extract email and password from request body
  const { email, password } = req.body;

  // Validate input - both email and password are required
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  // Find user in database using email (converted to lowercase and trimmed for consistency)
  const user = await User.findOne({
    where: { email: email.toLowerCase().trim() }
  });

  // Check if user exists and is active
  if (!user || !user.isActive)
    return res.status(401).json({ message: 'Invalid credentials' });

  // Compare entered password with hashed password in database
  const valid = await user.validatePassword(password);

  // If password does not match, reject login
  if (!valid)
    return res.status(401).json({ message: 'Invalid credentials' });

  // Generate JWT token for authenticated user
  const token = generateToken(user);

  // Send successful response with token and safe user data
  return res.json({
    success: true,
    token,

    // Only send non-sensitive user information
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

export default router;