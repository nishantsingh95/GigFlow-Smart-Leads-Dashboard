import { body, param, query } from 'express-validator';

const leadStatuses = ['New', 'Contacted', 'Qualified', 'Lost'];
const leadSources = ['Website', 'Instagram', 'Referral'];

export const createLeadValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 150 })
    .withMessage('Name cannot exceed 150 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('status')
    .optional()
    .isIn(leadStatuses)
    .withMessage(`Status must be one of: ${leadStatuses.join(', ')}`),
  body('source')
    .notEmpty()
    .withMessage('Source is required')
    .isIn(leadSources)
    .withMessage(`Source must be one of: ${leadSources.join(', ')}`),
];

export const updateLeadValidator = [
  param('id').isMongoId().withMessage('Invalid lead ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ max: 150 })
    .withMessage('Name cannot exceed 150 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('status')
    .optional()
    .isIn(leadStatuses)
    .withMessage(`Status must be one of: ${leadStatuses.join(', ')}`),
  body('source')
    .optional()
    .isIn(leadSources)
    .withMessage(`Source must be one of: ${leadSources.join(', ')}`),
];

export const leadIdValidator = [
  param('id').isMongoId().withMessage('Invalid lead ID'),
];

export const leadQueryValidator = [
  query('status')
    .optional()
    .isIn(leadStatuses)
    .withMessage(`Status must be one of: ${leadStatuses.join(', ')}`),
  query('source')
    .optional()
    .isIn(leadSources)
    .withMessage(`Source must be one of: ${leadSources.join(', ')}`),
  query('search').optional().trim().isLength({ max: 100 }),
  query('sort')
    .optional()
    .isIn(['latest', 'oldest'])
    .withMessage('Sort must be latest or oldest'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
];
