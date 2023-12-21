import express from 'express';
import {accountController} from '../controllers/accountController';

const router = express.Router();

router.get('/', accountController.getAccountByToken);

router.get('/transactions', accountController.getTransactions);
router.post('/transactions', accountController.addTransactions);

router.get('/:accountNr', accountController.getAccountByParams);

export const accountRouter = router;
