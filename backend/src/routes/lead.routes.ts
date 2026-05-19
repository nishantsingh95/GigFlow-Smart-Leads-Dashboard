import { Router } from 'express';
import {
  createLead,
  deleteLead,
  exportLeadsCSV,
  getLeadById,
  getLeads,
  updateLead,
} from '../controllers/lead.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createLeadValidator,
  leadIdValidator,
  leadQueryValidator,
  updateLeadValidator,
} from '../validators/lead.validator';

const router = Router();

router.use(authenticate);

router.get('/', validate(leadQueryValidator), getLeads);
router.get('/export/csv', authorize('admin'), validate(leadQueryValidator), exportLeadsCSV);
router.get('/:id', validate(leadIdValidator), getLeadById);
router.post('/', authorize('admin'), validate(createLeadValidator), createLead);
router.put('/:id', authorize('admin'), validate(updateLeadValidator), updateLead);
router.delete('/:id', authorize('admin'), validate(leadIdValidator), deleteLead);

export default router;
