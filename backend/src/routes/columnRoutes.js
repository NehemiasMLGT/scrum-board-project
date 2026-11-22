import { Router } from 'express';
import {
  updateColumn,
  deleteColumn
} from '../controllers/columnController.js';

const router = Router();

router.put('/:id', updateColumn);
router.delete('/:id', deleteColumn);

export default router;
