import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest, ApiResponse, JwtPayload } from '../types';
import { AppError } from '../middleware/errorHandler';

const signToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AppError('JWT secret not configured', 500);
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? '7d') as `${number}${'s' | 'm' | 'h' | 'd' | 'w' | 'y'}`;
  return jwt.sign(payload, secret, { expiresIn });
};

export const register = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body as {
      name: string; email: string; password: string;
    };

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ success: false, message: 'Email already registered.' });
      return;
    }

    // All self-registered users are sales by default.
    // Admins are created via the seed script or promoted by an existing admin.
    const user = await User.create({ name, email, password, role: 'sales' });

    const token = signToken({ id: user._id.toString(), email: user.email, role: user.role });

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = signToken({ id: user._id.toString(), email: user.email, role: user.role });

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } },
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }
    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (
  _req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    const mapped = users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
    }));
    res.status(200).json({ success: true, data: { users: mapped } });
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { newPassword } = req.body as { newPassword: string };

    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
      return;
    }

    const user = await User.findById(req.user!.id).select('+password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    user.password = newPassword;
    await user.save(); // triggers bcrypt pre-save hook

    res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    next(err);
  }
};

export const updateRole = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { role } = req.body as { role: string };

    if (!['admin', 'sales'].includes(role)) {
      res.status(400).json({ success: false, message: 'Role must be admin or sales.' });
      return;
    }

    // Prevent an admin from demoting themselves
    if (req.params.id === req.user!.id) {
      res.status(400).json({ success: false, message: 'You cannot change your own role.' });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}.`,
      data: { user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role } },
    });
  } catch (err) {
    next(err);
  }
};
