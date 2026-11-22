import { Router } from 'express';
import {
  updateMember,
  deleteMember,
  updateMemberStatus
} from '../controllers/memberController.js';

const router = Router();

router.put('/:id', updateMember);
router.delete('/:id', deleteMember);
router.patch('/:id/status', updateMemberStatus);

export default router;
