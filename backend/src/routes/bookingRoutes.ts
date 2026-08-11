import { Router } from 'express';
import { createBooking, getUserBookings, updateBookingStatus } from '../controllers/bookingController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// All booking routes require authentication
router.use(requireAuth);

router.post('/', createBooking);
router.get('/', getUserBookings);
router.patch('/:id/status', updateBookingStatus);

export default router;
