const Payment = require('../Models/Payment');
const Tenant = require('../Models/Tenant');
const tenantService = require('./TenantService');

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
        const startDate = new Date(month);
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);
        endDate.setDate(0); 
        endDate.setHours(23, 59, 59, 999);
    
        return await Payment.findOne({
            tenant: tenantId,
            month: {
                $gte: startDate,
                $lte: endDate
            }
        });
    }

    async listPaymentsForTenant(tenantId) {
        return await Payment.find({ tenant: tenantId }).sort({ month: -1 });
    }

    async listPayments() {
        return await Payment.find().sort({ month: -1 });
    }

    async getPaymentDetailsForMonth(tenantId) {
        // Fetch tenant details
        console.log("tenantId: ", tenantId);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        // Fetch payment details for the tenant for the current month
        const payment = await Payment.findOne({
            tenant: tenantId,
            month: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        });

        console.log("payment: ", payment);

        // Return both tenant and payment details
        return { payment };
    }
}

module.exports = new PaymentService();