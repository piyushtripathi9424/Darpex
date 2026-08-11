import { Router } from 'express';
import { 
  getAllBookings, 
  getAllCustomers, 
  updateBookingStatusAdmin,
  updateBookingSlotAdmin, 
  deleteBookingAdmin, 
  verifyBookingPaymentAdmin,
  adminLogin,
  registerAdmin,
  createService,
  updateService,
  deleteService,
  uploadServiceImage
} from '../controllers/adminController';
import { requireAdmin } from '../middleware/authMiddleware';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// Public routes
router.post('/login', adminLogin);
router.post('/register', registerAdmin);

// Protected routes (require Admin role)
router.use(requireAdmin);

router.get('/bookings', getAllBookings);
router.get('/customers', getAllCustomers);
router.put('/bookings/:id/status', updateBookingStatusAdmin);
router.put('/bookings/:id/slot', updateBookingSlotAdmin);
router.put('/bookings/:id/payment', verifyBookingPaymentAdmin);
router.delete('/bookings/:id', deleteBookingAdmin);

router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

router.post('/upload/image', upload.single('image'), uploadServiceImage);

export default router;
