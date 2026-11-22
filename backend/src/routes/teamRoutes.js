import { Router } from 'express';
import {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam
} from '../controllers/teamController.js';
import {
  addMemberToTeam,
  resetAllMembersStatus,
  reorderMembers
} from '../controllers/memberController.js';
import {
  getColumnsByTeam,
  createColumn
} from '../controllers/columnController.js';

const router = Router();

// Teams CRUD
router.get('/', getAllTeams);
router.get('/:id', getTeamById);
router.post('/', createTeam);
router.put('/:id', updateTeam);
router.delete('/:id', deleteTeam);

// Team Members nested endpoints
router.post('/:teamId/members', addMemberToTeam);
router.post('/:teamId/members/reset-status', resetAllMembersStatus);
router.post('/:teamId/members/reorder', reorderMembers);

// Team Columns nested endpoints
router.get('/:teamId/columns', getColumnsByTeam);
router.post('/:teamId/columns', createColumn);

export default router;
