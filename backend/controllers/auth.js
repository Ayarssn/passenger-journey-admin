import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { PASSENGER, ROLES } from '../utils/constants.js';

// Register new user (admin or passenger)
export const register = async (req, res) => {
  try {
    const {
      email,
      password,
      cin,
      phone,
      firstName,
      lastName
    } = req.body;

    // Always force role to 'passenger' for public registration
    const role = PASSENGER;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Create new user
    const newUser = new User({
      email,
      password,
      role,
      cin,
      phone,
      firstName,
      lastName
    });

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

    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      cin: user.cin,
      message: `Logged in as ${user.role}`
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

console.log('JWT_SECRET in login:', process.env.JWT_SECRET);

export const logout = (req, res) => {
  // No server-side token invalidation here (unless you implement blacklist)
  res.json({ message: "Logout successful." });
};

