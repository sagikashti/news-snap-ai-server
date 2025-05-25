import { Router } from 'express';
import { summarizeUrl } from '../controllers/summaryController';

const router = Router();

/**
 * @route   POST /api/summarize
 * @desc    Summarize content from a URL
 * @access  Public
 */
router.post('/summarize', summarizeUrl);

export default router;
