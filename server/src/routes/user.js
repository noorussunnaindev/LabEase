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

// Admin routes
router.get('/', authenticate, authorize('ADMIN'), getAllUsers);
router.get('/role/:role', authenticate, authorize('ADMIN'), getUsersByRole);
router.put('/:id/activate', authenticate, authorize('ADMIN'), activateUser);
router.put('/:id/deactivate', authenticate, authorize('ADMIN'), deactivateUser);
router.get('/stats', authenticate, authorize('ADMIN'), getUserStats);

export default router;
