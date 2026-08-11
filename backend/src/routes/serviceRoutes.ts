import { Router } from 'express';
import { getServices } from '../controllers/serviceController';

const router = Router();

// Public route to fetch active services
router.get('/', getServices);

export default router;
