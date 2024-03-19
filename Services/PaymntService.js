const Payment = require('../Models/Payment');

class PaymentService {
    async createOrUpdatePayment(tenantId, month, paymentDetails) {
        let payment = await Payment.findOne({ tenant: tenantId, month: month });

        if (payment) {
            payment.amountPaid += Number(paymentDetails.amountPaid);
            payment.remaining = payment.totalPayable - payment.amountPaid;
            payment.isPaid = payment.remaining === 0;
        } else {
            const totalPayable = Number(paymentDetails.rent) + Number(paymentDetails.electricBill) +
                Number(paymentDetails.gasBill) + Number(paymentDetails.waterBill) +
                Number(paymentDetails.otherBill);

            const remaining = totalPayable - Number(paymentDetails.amountPaid);
            const isPaid = remaining === 0;
            payment = new Payment({
                tenant: tenantId,
                month: month,
                ...paymentDetails,
                totalPayable: totalPayable,
                remaining: remaining,
                isPaid: isPaid,
            });
        }

        await payment.save();
        return payment;
    }

    async getPaymentDetails(tenantId, month) {
        return await Payment.findOne({ tenant: tenantId, month: new Date(month) });
    }

    async listPaymentsForTenant(tenantId) {
        return await Payment.find({ tenant: tenantId }).sort({ month: -1 });
    }
}

module.exports = new PaymentService();