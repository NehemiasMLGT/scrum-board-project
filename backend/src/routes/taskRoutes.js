import { Router } from 'express';
import {
  createTask,
  updateTask,
  moveTask,
  deleteTask
} from '../controllers/taskController.js';

const router = Router();

router.post('/', createTask);
router.put('/:id', updateTask);
router.patch('/:id/move', moveTask);
router.delete('/:id', deleteTask);

export default router;
