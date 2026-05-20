import { Router } from 'express';
import {
  getLeads, getLeadById, createLead,
  updateLead, deleteLead, exportLeadsCSV, getLeadStats,
} from '../controllers/leadController';
import { validateLead, validateLeadUpdate, validateObjectId } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/stats', getLeadStats);
router.get('/export/csv', exportLeadsCSV);
router.get('/', getLeads);
router.get('/:id', validateObjectId, getLeadById);
router.post('/', validateLead, createLead);
router.put('/:id', validateObjectId, validateLeadUpdate, updateLead);
router.delete('/:id', validateObjectId, authorize('admin'), deleteLead);

export default router;
