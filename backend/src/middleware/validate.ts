import { Request, Response, NextFunction } from 'express';
import { body, validationResult, param } from 'express-validator';
import { ApiResponse } from '../types';

const handleValidation = (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({ field: e.type, message: e.msg }));
    res.status(400).json({ success: false, message: 'Validation failed', errors: formatted });
    return;
  }
  next();
};

export const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'sales']).withMessage('Role must be admin or sales'),
  handleValidation,
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

export const validateLead = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']).withMessage('Invalid status'),
  body('source').isIn(['Website', 'Instagram', 'Referral']).withMessage('Invalid source'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
  handleValidation,
];

export const validateLeadUpdate = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']).withMessage('Invalid status'),
  body('source').optional().isIn(['Website', 'Instagram', 'Referral']).withMessage('Invalid source'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
  handleValidation,
];

export const validateObjectId = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  handleValidation,
];
