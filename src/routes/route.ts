import { Router } from 'express';
import { getForeCast } from '../controllers/controller';

const router = Router();

router.get('/weather/location', getForeCast);

export default router;
