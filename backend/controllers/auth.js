import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET; // In production, use process.env.JWT_SECRET

// Register new user (admin or passenger)
export const register = async (req, res) => {
  try {
    const { email, password, role = 'passenger' } = req.body;

    if (!['admin', 'passenger'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const newUser = new User({ email, password, role });
    await newUser.save();

    res.status(201).json({ message: `User registered successfully as ${role}` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Crée le payload JWT
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role
    };

    // Include role in token so frontend can redirect appropriately
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })

    res.json({
      token,
      role: user.role,
      message: `Logged in as ${user.role}`
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
