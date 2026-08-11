import { Router } from 'express';
import { getVehicles, addVehicle, updateVehicle, deleteVehicle, uploadVehicleImage } from '../controllers/vehicleController';
import { requireAuth } from '../middleware/authMiddleware';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// All vehicle routes require authentication
router.use(requireAuth);

router.get('/', getVehicles);
router.post('/', addVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);
router.post('/upload/image', upload.single('image'), uploadVehicleImage);

export default router;
