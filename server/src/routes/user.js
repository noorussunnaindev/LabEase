import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUsersByRole,
  activateUser,
  deactivateUser,
  getUserStats
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/change-password', authenticate, changePassword);

// Admin routes - specific routes first
router.get('/stats', authenticate, authorize('ADMIN'), getUserStats);
router.get('/role/:role', authenticate, authorize('ADMIN'), getUsersByRole);

// Parameterized routes
router.get('/', authenticate, authorize('ADMIN'), getAllUsers);
router.put('/:id/activate', authenticate, authorize('ADMIN'), activateUser);
router.put('/:id/deactivate', authenticate, authorize('ADMIN'), deactivateUser);

export default router;
