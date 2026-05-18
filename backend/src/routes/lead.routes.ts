import express from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from '../controllers/lead.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../models/User';

const router = express.Router();

// Apply protect middleware to all routes in this router
router.use(protect);

router.route('/')
  .get(getLeads)
  .post(createLead);

// Export route must be before /:id to avoid matching 'export' as an ID
router.get('/export/csv', authorize(UserRole.ADMIN), exportLeadsCSV);

router.route('/:id')
  .get(getLeadById)
  .put(updateLead)
  .delete(authorize(UserRole.ADMIN), deleteLead);

export default router;
