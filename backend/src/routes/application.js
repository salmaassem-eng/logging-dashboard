import express from 'express';
import {
  getApps,
  getAppByName,
  createApp,
  deleteApp,
} from '../controllers/application.js';
import { getLogs, postLog } from '../controllers/log.js';
import { protect, verifyIngestionKey } from '../middleware/auth.js';

const router = express.Router();

// Application CRUD routes (Requires standard developer JWT session authentication)
router.route('/')
  .get(protect, getApps)
  .post(protect, createApp);

router.route('/:name')
  .get(protect, getAppByName)
  .delete(protect, deleteApp);

// Logs routes nested under application name namespace
// 1. Fetching logs: Requires developer JWT session authentication
router.get('/:name/logs', protect, getLogs);

// 2. Ingesting logs: Requires client x-api-key authentication (Used by Server SDK)
router.post('/:name/logs', verifyIngestionKey, postLog);

export default router;
