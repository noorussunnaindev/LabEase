import express from 'express';
import {
  createTest,
  getTests,
  getTestById,
  searchTests,
  updateTest,
  deleteTest,
  getTestsByCategory
} from '../controllers/testController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getTests);
router.get('/search', searchTests);
router.get('/:id', getTestById);
router.get('/category/:categoryId', getTestsByCategory);

// Admin only
router.post('/', authenticate, authorize('ADMIN'), createTest);
router.put('/:id', authenticate, authorize('ADMIN'), updateTest);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteTest);

export default router;
