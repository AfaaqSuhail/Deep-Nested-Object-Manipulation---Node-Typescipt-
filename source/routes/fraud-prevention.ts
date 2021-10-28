import express from 'express';
import controller from '../controllers/fraud-prevention';
const router = express.Router();

router.get('/api/transaction/:transactionId/:confidenceLevel', controller.getTransactions);

export = router;