const express = require('express');
const router = express.Router();
const PaymentService = require('../Services/PaymntService');

router.get('/', async (req, res) => {
    try {
        const payments = await PaymentService.listPayments();
        res.json(payments);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/create', async (req, res) => {
    try {
        const { tenant, month, ...paymentDetails } = req.body;
        const payment = await PaymentService.createOrUpdatePayment(tenant, month, paymentDetails);
        res.json(payment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/:tenantId/:month', async (req, res) => {
    try {
        const { tenantId, month } = req.params;
        const payment = await PaymentService.getPaymentDetails(tenantId, month);
        if (!payment) {
            return res.status(404).json({ message: 'Payment record not found' });
        }
        res.json(payment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/:tenantId', async (req, res) => {
    try {
        const { tenantId } = req.params;
        const payments = await PaymentService.listPaymentsForTenant(tenantId);
        console.log(payments);
        
        res.json(payments);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
