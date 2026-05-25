// backend/src/routes/log.js
import express from 'express';
import { getLogs, postLog } from '../controllers/log.js';
import { protect, verifyIngestionKey } from '../middleware/auth.js';

const router = express.Router();

// Fetch logs – protected by JWT sessionouter.get('/:name/logs', protect, getLogs);

// Ingest logs – protected by API keyouter.post('/:name/logs', verifyIngestionKey, postLog);

export default router;
