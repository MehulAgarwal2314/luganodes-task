import express from 'express';
import Deposit from '../models/Deposits.js';

const router = express.Router();

router.get('/deposits', async (req, res) => {
    try {
        const deposits = await Deposit.find();
        res.json(deposits);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching deposits' });
    }
});

export default router;
