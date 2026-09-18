import { Router } from 'express';
import { register, login, getMe, googleAuth } from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/google', googleAuth);

// Protected routes
router.get('/me', requireAuth, getMe);

export default router;
